#!/usr/bin/env node
// Compares two eval runs per scenario and arm: node evals/compare.mjs <before-run-dir> <after-run-dir>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [beforeDir, afterDir] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error('Usage: node evals/compare.mjs <before-run-dir> <after-run-dir>');
  process.exit(2);
}

const load = dir => JSON.parse(readFileSync(join(dir, 'summary.json'), 'utf8'));
const arms = ['with', 'available', 'without'];

function tally(results) {
  const groups = new Map();
  for (const result of results) {
    const key = `${result.scenario}\t${result.arm}`;
    const group = groups.get(key) ?? { passed: 0, total: 0, clean: 0, runs: 0, activated: 0 };
    group.passed += result.checks.filter(check => check.pass).length;
    group.total += result.checks.length;
    group.clean += result.checks.every(check => check.pass) ? 1 : 0;
    group.activated += result.activated ? 1 : 0;
    group.runs += 1;
    groups.set(key, group);
  }
  return groups;
}

const before = tally(load(beforeDir));
const after = tally(load(afterDir));
const keys = [...new Set([...before.keys(), ...after.keys()])].sort((a, b) => {
  const [sa, aa] = a.split('\t');
  const [sb, ab] = b.split('\t');
  return sa.localeCompare(sb) || arms.indexOf(aa) - arms.indexOf(ab);
});
const cell = group => (group ? `${group.passed}/${group.total} (${group.clean}/${group.runs} clean)` : '-');
const mark = (b, a) => (!b || !a ? '' : a.passed / a.total > b.passed / b.total ? 'better' : a.passed / a.total < b.passed / b.total ? 'worse' : '');

console.log('| Scenario | Arm | Before | After | Change |');
console.log('| --- | --- | --- | --- | --- |');
for (const key of keys) {
  const [scenario, arm] = key.split('\t');
  console.log(`| ${scenario} | ${arm} | ${cell(before.get(key))} | ${cell(after.get(key))} | ${mark(before.get(key), after.get(key))} |`);
}

const activation = keys.filter(key => key.endsWith('\tavailable'));
if (activation.length > 0) {
  console.log('\nActivation without the slash command (before -> after):');
  for (const key of activation) {
    const [b, a] = [before.get(key), after.get(key)];
    console.log(`- ${key.split('\t')[0]}: ${b ? `${b.activated}/${b.runs}` : '-'} -> ${a ? `${a.activated}/${a.runs}` : '-'}`);
  }
}
