#!/usr/bin/env node
// Runs each scenario in a fresh fixture repo, with and without the skill, then grades what the agent did.
import { execFileSync, spawn } from 'node:child_process';
import { appendFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { grade, parseTranscript, skillActivated } from './graders.mjs';

const evalsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(evalsDir, '..');
const usage = `Usage: node evals/run.mjs [options]

  --suite <name>        Suite folder under evals/ (default: assume-task)
  --scenario <ids>      Comma-separated scenario ids (default: all)
  --arm <arms>          Comma-separated arms (default: with,available,without)
                        with: skills installed and the prompt starts with /<skill>
                        available: skills installed, plain prompt (measures activation)
                        without: no skills
  --trials <n>          Runs per scenario and arm (default: 1)
  --model <model>       Model passed to claude (default: sonnet)
  --concurrency <n>     Runs at once (default: 2)
  --timeout <minutes>   Limit per run (default: 30)
  --dry-run             Build the fixture repos and print the command without calling a model`;

function parseArgs(argv) {
  const options = { suite: 'assume-task', scenarios: null, arms: allArms, trials: 1, model: 'sonnet', concurrency: 2, timeout: 30, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = () => {
      if (i + 1 >= argv.length) throw new Error(`Missing value for ${flag}`);
      return argv[++i];
    };
    if (flag === '--suite') options.suite = value();
    else if (flag === '--scenario') options.scenarios = value().split(',');
    else if (flag === '--arm') options.arms = value().split(',');
    else if (flag === '--trials') options.trials = Number(value());
    else if (flag === '--model') options.model = value();
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--timeout') options.timeout = Number(value());
    else if (flag === '--dry-run') options.dryRun = true;
    else if (flag === '-h' || flag === '--help') {
      console.log(usage);
      process.exit(0);
    } else throw new Error(`Unknown option ${flag}\n\n${usage}`);
  }
  const unknown = options.arms.filter(arm => !allArms.includes(arm));
  if (unknown.length > 0) throw new Error(`Unknown arm ${unknown.join(', ')}; use ${allArms.join(', ')}`);
  return options;
}

const allArms = ['with', 'available', 'without'];

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const lines = text => text.split('\n').filter(Boolean);

function prepare(suiteDir, scenario, arm, runDir) {
  const repo = join(runDir, 'repo');
  const remote = join(runDir, 'remote.git');
  cpSync(join(suiteDir, 'fixture'), repo, { recursive: true });
  if (scenario.overlay) cpSync(join(suiteDir, 'overlays', scenario.overlay), repo, { recursive: true });
  const ceiling = scenario.ceilingText ?? `\`${scenario.ceiling}\``;
  writeFileSync(join(repo, 'AGENTS.md'), readFileSync(join(suiteDir, 'agents.md.tmpl'), 'utf8').replaceAll('{{ceiling}}', ceiling));

  git(runDir, 'init', '-q', '--bare', remote);
  git(repo, 'init', '-q', '-b', 'main');
  for (const [key, value] of [['user.name', 'Eval Fixture'], ['user.email', 'eval@example.invalid'], ['commit.gpgsign', 'false'], ['core.hooksPath', '.git/hooks']]) {
    git(repo, 'config', key, value);
  }
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'Initial commit');
  git(repo, 'remote', 'add', 'origin', remote);
  git(repo, 'push', '-q', 'origin', 'main');
  appendFileSync(join(repo, '.git', 'info', 'exclude'), '.claude/\n');

  if (arm !== 'without') {
    const skillsDir = join(repo, '.claude', 'skills');
    mkdirSync(skillsDir, { recursive: true });
    for (const name of readdirSync(join(repoRoot, 'skills'))) {
      if (existsSync(join(repoRoot, 'skills', name, 'SKILL.md'))) symlinkSync(join(repoRoot, 'skills', name), join(skillsDir, name));
    }
  }
  return { repo, remote, baseSha: git(repo, 'rev-parse', 'HEAD'), remoteBefore: git(repo, 'ls-remote', remote) };
}

function agentCommand(prompt, model) {
  return ['claude', ['-p', prompt, '--output-format', 'stream-json', '--verbose', '--model', model, '--setting-sources', 'project', '--strict-mcp-config', '--no-session-persistence', '--dangerously-skip-permissions']];
}

function runAgent(prompt, model, repo, runDir, suiteDir, timeoutMs) {
  const [command, args] = agentCommand(prompt, model);
  const env = { ...process.env, PATH: `${join(evalsDir, 'bin')}:${process.env.PATH}`, EVAL_GH_LOG: join(runDir, 'gh.log'), EVAL_TICKETS: join(suiteDir, 'tickets.json') };
  writeFileSync(env.EVAL_GH_LOG, '');
  return new Promise(done => {
    const child = spawn(command, args, { cwd: repo, env, stdio: ['ignore', 'pipe', 'pipe'] });
    const stdout = [];
    const stderr = [];
    let timedOut = false;
    child.stdout.on('data', chunk => stdout.push(chunk));
    child.stderr.on('data', chunk => stderr.push(chunk));
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeoutMs);
    child.on('close', code => {
      clearTimeout(timer);
      writeFileSync(join(runDir, 'transcript.jsonl'), Buffer.concat(stdout));
      writeFileSync(join(runDir, 'stderr.log'), Buffer.concat(stderr));
      done({ exitCode: code, timedOut });
    });
  });
}

// The agent may fix the bug in a separate worktree, so grade the first worktree on a non-main branch when one exists.
function resultTree(repo) {
  const worktrees = git(repo, 'worktree', 'list', '--porcelain').split('\n\n').map(block => ({
    path: block.match(/^worktree (.+)$/m)?.[1],
    branch: block.match(/^branch refs\/heads\/(.+)$/m)?.[1] ?? 'HEAD',
  }));
  return worktrees.find(tree => tree.path !== repo && tree.branch !== 'main') ?? worktrees.find(tree => tree.path === repo) ?? { path: repo, branch: 'HEAD' };
}

function collect(scenario, prepared, runDir, suiteDir) {
  const { repo, remote, baseSha, remoteBefore } = prepared;
  const tree = resultTree(repo);
  const changedFiles = new Set([
    ...lines(git(tree.path, 'diff', '--name-only', baseSha)),
    ...lines(git(tree.path, 'ls-files', '--others', '--exclude-standard')),
    ...lines(git(repo, 'log', '--all', '--not', baseSha, '--name-only', '--format=')),
  ]);
  let oraclePassed = null;
  if (scenario.oracle) {
    try {
      execFileSync('node', [join(suiteDir, 'oracles', `${scenario.oracle}.mjs`), tree.path], { cwd: runDir, stdio: 'pipe', timeout: 60_000 });
      oraclePassed = true;
    } catch (error) {
      oraclePassed = false;
      writeFileSync(join(runDir, 'oracle.log'), `${error.stdout ?? ''}${error.stderr ?? ''}`);
    }
  }
  return {
    ...parseTranscript(readFileSync(join(runDir, 'transcript.jsonl'), 'utf8')),
    ghCalls: lines(readFileSync(join(runDir, 'gh.log'), 'utf8')).map(line => JSON.parse(line)),
    oraclePassed,
    git: {
      baseSha,
      branch: tree.branch,
      mainSha: git(repo, 'rev-parse', 'main'),
      newCommits: Number(git(repo, 'rev-list', '--count', '--all', '--not', baseSha)),
      changedFiles: [...changedFiles],
      remoteBefore,
      remoteAfter: git(repo, 'ls-remote', remote),
    },
  };
}

async function pool(items, size, worker) {
  const results = [];
  let next = 0;
  const lanes = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(lanes);
  return results;
}

function summarize(results) {
  const rows = results.map(result => {
    const passed = result.checks.filter(check => check.pass).length;
    const failed = result.checks.filter(check => !check.pass).map(check => check.check);
    const cost = result.costUsd == null ? '?' : `$${result.costUsd.toFixed(2)}`;
    const minutes = result.durationMs == null ? '?' : (result.durationMs / 60_000).toFixed(1);
    const status = result.timedOut ? ' (timed out)' : result.isError ? ' (agent error)' : '';
    return `| ${result.scenario} | ${result.arm} | ${result.trial} | ${passed}/${result.checks.length}${status} | ${failed.join(', ') || '-'} | ${cost} | ${minutes} |`;
  });
  const arms = allArms.filter(arm => results.some(result => result.arm === arm)).map(arm => {
    const runs = results.filter(result => result.arm === arm);
    const checks = runs.flatMap(result => result.checks);
    const clean = runs.filter(result => result.checks.every(check => check.pass)).length;
    return `- **${arm}:** ${checks.filter(check => check.pass).length}/${checks.length} checks, ${clean}/${runs.length} runs with every check passing`;
  });
  const activation = [...new Set(results.filter(result => result.arm === 'available').map(result => result.scenario))].map(scenario => {
    const runs = results.filter(result => result.arm === 'available' && result.scenario === scenario);
    return `- ${scenario}: activated in ${runs.filter(result => result.activated).length}/${runs.length} (expected ${runs[0].shouldActivate ? 'yes' : 'no'})`;
  });
  const leaks = results.filter(result => result.isolationProblem).map(result => `- ${result.scenario} ${result.arm} #${result.trial}: ${result.isolationProblem}`);
  return [
    '| Scenario | Arm | Trial | Checks | Failed | Cost | Minutes |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
    ...arms,
    ...(activation.length > 0 ? ['', 'Activation without the slash command:', ...activation] : []),
    ...(leaks.length > 0 ? ['', 'Isolation problems:', ...leaks] : []),
  ].join('\n');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const suiteDir = join(evalsDir, options.suite);
  const suite = JSON.parse(readFileSync(join(suiteDir, 'scenarios.json'), 'utf8'));
  const scenarios = options.scenarios ? suite.scenarios.filter(item => options.scenarios.includes(item.id)) : suite.scenarios;
  if (scenarios.length === 0) throw new Error('No matching scenarios');
  const outDir = join(evalsDir, '.runs', new Date().toISOString().replace(/[:.]/g, '-'));
  const jobs = scenarios.flatMap(scenario =>
    options.arms
      .filter(arm => !scenario.arms || scenario.arms.includes(arm))
      .flatMap(arm => Array.from({ length: options.trials }, (_, i) => ({ scenario, arm, trial: i + 1 }))));

  const results = await pool(jobs, options.concurrency, async ({ scenario, arm, trial }) => {
    const runDir = join(outDir, `${scenario.id}.${arm}.${trial}`);
    mkdirSync(runDir, { recursive: true });
    const prepared = prepare(suiteDir, scenario, arm, runDir);
    const task = (scenario.prompt ?? suite.prompt).replaceAll('{{issue}}', String(scenario.issue));
    const prompt = arm === 'with' ? `/${suite.skill} ${task}` : task;
    if (options.dryRun) {
      const [command, args] = agentCommand(prompt, options.model);
      console.log(`${relative(repoRoot, prepared.repo)}: ${command} ${args.map(arg => JSON.stringify(arg)).join(' ')}`);
      return null;
    }
    console.log(`start  ${scenario.id} ${arm} #${trial}`);
    const { exitCode, timedOut } = await runAgent(prompt, options.model, prepared.repo, runDir, suiteDir, options.timeout * 60_000);
    const outcome = collect(scenario, prepared, runDir, suiteDir);
    const listed = outcome.skills.includes(suite.skill);
    const result = {
      scenario: scenario.id,
      arm,
      trial,
      prompt,
      model: options.model,
      exitCode,
      timedOut,
      isError: outcome.isError,
      costUsd: outcome.costUsd,
      durationMs: outcome.durationMs,
      turns: outcome.turns,
      activated: arm === 'with' || skillActivated(outcome.toolCalls, suite.skill),
      shouldActivate: scenario.shouldActivate !== false,
      isolationProblem: arm === 'without' && listed ? `${suite.skill} was available` : arm !== 'without' && !outcome.isError && !listed ? `${suite.skill} was not loaded` : null,
      checks: grade(scenario, outcome),
      finalText: outcome.finalText,
    };
    writeFileSync(join(runDir, 'result.json'), JSON.stringify(result, null, 2));
    console.log(`finish ${scenario.id} ${arm} #${trial}: ${result.checks.filter(check => check.pass).length}/${result.checks.length} checks`);
    return result;
  });

  if (options.dryRun) return;
  const summary = summarize(results);
  writeFileSync(join(outDir, 'summary.md'), `# ${suite.skill} evals (${options.model})\n\n${summary}\n`);
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(results, null, 2));
  console.log(`\n${summary}\n\nRuns saved in ${relative(process.cwd(), outDir)}`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
