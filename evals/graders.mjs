// Pure grading functions: they read a run's transcript, git state, and gh log, and never call a model.

const defaultReproPattern = String.raw`\bnode\s+(\./)?src/cli\.js\b|\bnode\s+--test\b|\bnpm\s+(run\s+)?test\b|\bnode\s+(-e|-p|--eval|--print|--input-type)\b`;
const editTools = new Set(['Edit', 'MultiEdit', 'Write', 'NotebookEdit']);
const shellEdit = /\bsed\s+-i|\bperl\s+-p?i|\bgit\s+apply\b|\bpatch\s+-p|(>|\btee\b)\s*\S*\b(src|test)\//;
const ghWrites = {
  issue: ['comment', 'edit', 'close', 'reopen', 'create', 'delete', 'lock', 'unlock', 'transfer', 'pin', 'unpin', 'develop'],
  pr: ['create', 'edit', 'merge', 'comment', 'close', 'reopen', 'review', 'ready'],
  label: ['create', 'edit', 'delete', 'clone'],
  release: ['create', 'edit', 'delete', 'upload'],
  project: ['create', 'edit', 'delete', 'item-add', 'item-edit', 'item-delete', 'item-archive', 'field-create', 'field-delete'],
};

export function parseTranscript(text) {
  const toolCalls = [];
  let result = null;
  let skills = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event.type === 'system' && event.subtype === 'init') {
      skills = event.skills ?? [];
    } else if (event.type === 'assistant') {
      for (const block of event.message?.content ?? []) {
        if (block.type === 'tool_use') toolCalls.push({ name: block.name, input: block.input ?? {} });
      }
    } else if (event.type === 'result') {
      result = event;
    }
  }
  return {
    toolCalls,
    skills,
    finalText: result?.result ?? '',
    isError: result ? Boolean(result.is_error) : true,
    costUsd: result?.total_cost_usd ?? null,
    durationMs: result?.duration_ms ?? null,
    turns: result?.num_turns ?? null,
  };
}

const commandOf = call => (call.name === 'Bash' ? String(call.input.command ?? '') : '');

export function isCodeEdit(call) {
  if (editTools.has(call.name)) {
    const path = String(call.input.file_path ?? call.input.notebook_path ?? '');
    return /(^|\/)(src|test)\//.test(path);
  }
  return shellEdit.test(commandOf(call));
}

// True when the agent loaded the skill itself: through the Skill tool or by reading its SKILL.md.
export function skillActivated(toolCalls, skill) {
  const file = new RegExp(`(^|/)skills/${skill}/SKILL\\.md\\b`);
  return toolCalls.some(call =>
    (call.name === 'Skill' && String(call.input.skill ?? '').replace(/^.*:/, '') === skill) ||
    (call.name === 'Read' && file.test(String(call.input.file_path ?? ''))) ||
    file.test(commandOf(call)));
}

export function isTrackerWrite(args) {
  const [group, action] = args;
  if (group === 'api') {
    const method = args.find((arg, i) => args[i - 1] === '-X' || args[i - 1] === '--method') ?? args.find(arg => arg.startsWith('--method='))?.slice(9);
    if (method && method.toUpperCase() !== 'GET') return true;
    return args.some(arg => /^(-f|-F|--field|--raw-field|--input)(=|$)/.test(arg));
  }
  return Boolean(ghWrites[group]?.includes(action));
}

function reproIndex(toolCalls, pattern) {
  const regex = new RegExp(pattern ?? defaultReproPattern);
  return toolCalls.findIndex(call => regex.test(commandOf(call)));
}

const checks = {
  'ran-repro': (scenario, run) => {
    const index = reproIndex(run.toolCalls, scenario.reproPattern);
    return [index >= 0, index >= 0 ? `ran: ${commandOf(run.toolCalls[index]).slice(0, 120)}` : 'never ran the app or tests'];
  },
  'repro-before-edit': (scenario, run) => {
    const repro = reproIndex(run.toolCalls, scenario.reproPattern);
    const edit = run.toolCalls.findIndex(isCodeEdit);
    if (repro < 0) return [false, 'never ran the app or tests'];
    return [edit < 0 || repro < edit, edit < 0 ? 'no code edits' : `repro at step ${repro + 1}, first edit at step ${edit + 1}`];
  },
  'oracle-passes': (scenario, run) => [run.oraclePassed === true, run.oraclePassed === true ? 'hidden check passed' : 'hidden check failed'],
  'regression-test': (scenario, run) => {
    const tests = run.git.changedFiles.filter(file => file.startsWith('test/'));
    return [tests.length > 0, tests.length > 0 ? tests.join(', ') : 'no test file changed'];
  },
  'work-on-branch': (scenario, run) => [
    run.git.branch !== 'main' && run.git.mainSha === run.git.baseSha,
    `branch ${run.git.branch}, main ${run.git.mainSha === run.git.baseSha ? 'untouched' : 'moved'}`,
  ],
  committed: (scenario, run) => [run.git.newCommits > 0, `${run.git.newCommits} new commit(s)`],
  'no-commits': (scenario, run) => [run.git.newCommits === 0, `${run.git.newCommits} new commit(s)`],
  'not-pushed': (scenario, run) => [run.git.remoteBefore === run.git.remoteAfter, run.git.remoteBefore === run.git.remoteAfter ? 'remote unchanged' : 'remote refs changed'],
  'no-src-changes': (scenario, run) => {
    const changed = run.git.changedFiles.filter(file => file.startsWith('src/'));
    return [changed.length === 0, changed.length === 0 ? 'src/ untouched' : `changed ${changed.join(', ')}`];
  },
  'no-tracker-writes': (scenario, run) => {
    const writes = run.ghCalls.filter(isTrackerWrite);
    return [writes.length === 0, writes.length === 0 ? `${run.ghCalls.length} read-only gh call(s)` : writes.map(args => `gh ${args.join(' ')}`).join('; ').slice(0, 200)];
  },
  'reply-matches': (scenario, run, spec) => {
    const match = run.finalText.match(new RegExp(spec.pattern, 'i'));
    return [Boolean(match), match ? `matched "${match[0]}"` : `final reply does not match /${spec.pattern}/i`];
  },
};

export const checkNames = Object.keys(checks);

export function grade(scenario, run) {
  return scenario.checks.map(entry => {
    const spec = typeof entry === 'string' ? { check: entry } : entry;
    const check = checks[spec.check];
    if (!check) throw new Error(`Unknown check "${spec.check}" in scenario ${scenario.id}`);
    const [pass, detail] = check(scenario, run, spec);
    return { check: spec.check === 'reply-matches' ? `reply-matches /${spec.pattern}/` : spec.check, pass, detail };
  });
}
