// Hidden check, run against the agent's working tree after the run. Exits non-zero on failure.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = process.argv[2];
const { total } = await import(pathToFileURL(join(repo, 'src/total.js')).href);
assert.equal(total({ code: 'SAVE10', items: [{ sku: 'DESK-01', price: 12000, qty: 1 }] }), 10800);
assert.equal(total({ code: 'SAVE10', items: [{ sku: 'LAMP-03', price: 6000, qty: 1 }] }), 6000);

const output = execFileSync('node', [join(repo, 'src/cli.js'), join(repo, 'orders/large.json')], { encoding: 'utf8' });
assert.match(output, /Discount: \$12\.00/);
assert.match(output, /Total: +\$108\.00/);
