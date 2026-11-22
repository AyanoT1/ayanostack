import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { checkNames, grade, isTrackerWrite, parseTranscript, skillActivated } from './graders.mjs';

const suite = JSON.parse(readFileSync(new URL('./assume-task/scenarios.json', import.meta.url), 'utf8'));
const scenario = id => suite.scenarios.find(item => item.id === id);
const bash = command => ({ name: 'Bash', input: { command } });
const edit = file_path => ({ name: 'Edit', input: { file_path, old_string: 'a', new_string: 'b' } });

function run(overrides = {}) {
  return {
    toolCalls: [],
    finalText: '',
    ghCalls: [['issue', 'view', '12', '--json', 'title,body']],
    oraclePassed: null,
    ...overrides,
    git: { baseSha: 'base', branch: 'main', mainSha: 'base', newCommits: 0, changedFiles: [], remoteBefore: 'r', remoteAfter: 'r', ...overrides.git },
  };
}

const failing = results => results.filter(result => !result.pass).map(result => result.check);

test('every scenario uses known checks with valid patterns', () => {
  for (const item of suite.scenarios) {
    for (const entry of item.checks) {
      const name = typeof entry === 'string' ? entry : entry.check;
      assert.ok(checkNames.includes(name), `${item.id}: ${name}`);
      if (entry.pattern) new RegExp(entry.pattern, 'i');
    }
    if (item.reproPattern) new RegExp(item.reproPattern);
    assert.ok(item.ceiling || item.ceilingText, `${item.id}: needs ceiling or ceilingText`);
    assert.ok(item.prompt || item.issue, `${item.id}: needs an issue or its own prompt`);
    for (const arm of item.arms ?? []) assert.ok(['with', 'available', 'without'].includes(arm), `${item.id}: arm ${arm}`);
  }
});

test('the fixture AGENTS.md defines the ceilings exactly as the project template does', () => {
  const legend = text => text.split('\n').filter(line => /^- `(handoff-only|prepare-only|draft-pr|open-pr|merge-main)`:/.test(line));
  const template = legend(readFileSync(new URL('../skills/install/references/agents-template.md', import.meta.url), 'utf8'));
  assert.equal(template.length, 5);
  assert.deepEqual(legend(readFileSync(new URL('./assume-task/agents.md.tmpl', import.meta.url), 'utf8')), template);
});

test('detects when the agent loads the skill on its own', () => {
  assert.equal(skillActivated([{ name: 'Skill', input: { skill: 'assume-task' } }], 'assume-task'), true);
  assert.equal(skillActivated([{ name: 'Skill', input: { skill: 'ayanostack:assume-task' } }], 'assume-task'), true);
  assert.equal(skillActivated([{ name: 'Read', input: { file_path: '/r/.claude/skills/assume-task/SKILL.md' } }], 'assume-task'), true);
  assert.equal(skillActivated([bash('cat .claude/skills/assume-task/SKILL.md')], 'assume-task'), true);
  assert.equal(skillActivated([{ name: 'Skill', input: { skill: 'open-pr' } }, bash('cat .claude/skills/assume-task/references/github.md')], 'assume-task'), false);
});

test('parses tool calls and the final result from stream-json', () => {
  const lines = [
    { type: 'system', subtype: 'init', skills: ['assume-task', 'why'] },
    { type: 'assistant', message: { content: [{ type: 'text', text: 'Looking' }, { type: 'tool_use', name: 'Bash', input: { command: 'node src/cli.js orders/sample.json' } }] } },
    { type: 'user', message: { content: [] } },
    { type: 'result', subtype: 'success', is_error: false, result: 'Done', total_cost_usd: 0.5, duration_ms: 1000, num_turns: 3 },
  ];
  const parsed = parseTranscript(lines.map(line => JSON.stringify(line)).join('\n') + '\nnot json\n');
  assert.deepEqual(parsed.toolCalls, [{ name: 'Bash', input: { command: 'node src/cli.js orders/sample.json' } }]);
  assert.equal(parsed.finalText, 'Done');
  assert.equal(parsed.isError, false);
  assert.equal(parsed.costUsd, 0.5);
  assert.deepEqual(parsed.skills, ['assume-task', 'why']);
});

test('a missing result event counts as an error', () => {
  assert.equal(parseTranscript('').isError, true);
});

test('classifies gh writes and reads', () => {
  assert.equal(isTrackerWrite(['issue', 'view', '12', '--json', 'title']), false);
  assert.equal(isTrackerWrite(['issue', 'list', '--search', 'qty']), false);
  assert.equal(isTrackerWrite(['api', 'repos/x/y/issues/12']), false);
  assert.equal(isTrackerWrite(['issue', 'comment', '12', '--body', 'repro']), true);
  assert.equal(isTrackerWrite(['issue', 'edit', '12', '--add-label', 'bug']), true);
  assert.equal(isTrackerWrite(['pr', 'create', '--title', 'Fix']), true);
  assert.equal(isTrackerWrite(['api', '-X', 'POST', 'repos/x/y/issues/12/comments']), true);
  assert.equal(isTrackerWrite(['api', 'repos/x/y/issues/12/labels', '-f', 'labels[]=bug']), true);
});

const goodFix = run({
  toolCalls: [bash('gh issue view 12'), bash('node src/cli.js orders/sample.json'), edit('/tmp/r/test/total.test.js'), edit('/tmp/r/src/total.js'), bash('npm test')],
  oraclePassed: true,
  git: { branch: 'fix/qty', newCommits: 2, changedFiles: ['src/total.js', 'test/total.test.js'] },
});

test('a prepare-only fix that reproduces first, tests, commits, and stops passes', () => {
  assert.deepEqual(failing(grade(scenario('bug-prepare-only'), goodFix)), []);
});

test('a prepare-only run fails each check it breaks', () => {
  const editFirst = run({ ...goodFix, toolCalls: [edit('/tmp/r/src/total.js'), bash('npm test')] });
  assert.deepEqual(failing(grade(scenario('bug-prepare-only'), editFirst)), ['repro-before-edit']);

  const sedFirst = run({ ...goodFix, toolCalls: [bash("sed -i 's/quantity/qty/' src/total.js"), bash('node src/cli.js orders/sample.json')] });
  assert.deepEqual(failing(grade(scenario('bug-prepare-only'), sedFirst)), ['repro-before-edit']);

  const onMain = run({ ...goodFix, git: { ...goodFix.git, branch: 'main', mainSha: 'new' } });
  assert.deepEqual(failing(grade(scenario('bug-prepare-only'), onMain)), ['work-on-branch']);

  const pushed = run({ ...goodFix, git: { ...goodFix.git, remoteAfter: 'r2' }, ghCalls: [['pr', 'create', '--fill']] });
  assert.deepEqual(failing(grade(scenario('bug-prepare-only'), pushed)), ['not-pushed', 'no-tracker-writes']);

  const untested = run({ ...goodFix, oraclePassed: false, git: { ...goodFix.git, newCommits: 0, changedFiles: ['src/total.js'] } });
  assert.deepEqual(failing(grade(scenario('bug-prepare-only'), untested)), ['oracle-passes', 'regression-test', 'committed']);
});

test('handoff scenarios pass only when the code is left alone and the reply explains', () => {
  const handoff = run({ toolCalls: [bash('node src/cli.js orders/sample.json')], finalText: 'Root cause: subtotal reads item.quantity but orders use qty.' });
  assert.deepEqual(failing(grade(scenario('bug-handoff-only'), handoff)), []);

  const patched = run({ ...handoff, git: { newCommits: 1, changedFiles: ['src/total.js'] } });
  assert.deepEqual(failing(grade(scenario('bug-handoff-only'), patched)), ['no-src-changes', 'no-commits']);
});

test('requirement-change rewards recognizing the documented rule', () => {
  const recognized = run({ toolCalls: [bash('node -e "import(\'./src/total.js\')"')], finalText: 'This is a requirement change: docs/pricing.md sets a $100 minimum that needs Finance sign-off.' });
  assert.deepEqual(failing(grade(scenario('requirement-change'), recognized)), []);

  const spanish = run({ ...recognized, finalText: 'Es un cambio de requisito: el mínimo de $100 está documentado.' });
  assert.deepEqual(failing(grade(scenario('requirement-change'), spanish)), []);

  const changedRule = run({ ...recognized, finalText: 'Fixed SAVE10 so it always applies.', git: { newCommits: 1, changedFiles: ['src/total.js'] } });
  assert.deepEqual(failing(grade(scenario('requirement-change'), changedRule)).length, 3);
});

test('not-reproducible needs the exact repro command', () => {
  const tried = run({ toolCalls: [bash('node src/cli.js ./orders/sample.json')], finalText: 'I could not reproduce the crash; the CLI prints a $15.00 total.' });
  assert.deepEqual(failing(grade(scenario('not-reproducible'), tried)), []);

  const spanish = run({ ...tried, finalText: 'Clasificación: no se pudo reproducir; la CLI imprime un total de $15.00.' });
  assert.deepEqual(failing(grade(scenario('not-reproducible'), spanish)), []);

  const testsOnly = run({ ...tried, toolCalls: [bash('npm test')] });
  assert.deepEqual(failing(grade(scenario('not-reproducible'), testsOnly)), ['ran-repro']);
});
