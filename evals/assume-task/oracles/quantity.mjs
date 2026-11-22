// Hidden check, run against the agent's working tree after the run. Exits non-zero on failure.
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const { total } = await import(pathToFileURL(join(process.argv[2], 'src/total.js')).href);
assert.equal(total({ items: [{ sku: 'NB-01', price: 400, qty: 3 }, { sku: 'PEN-02', price: 150, qty: 2 }] }), 1500);
assert.equal(total({ code: 'SAVE10', items: [{ sku: 'DESK-01', price: 12000, qty: 1 }] }), 10800);
assert.equal(total({ code: 'SAVE10', items: [{ sku: 'LAMP-03', price: 3000, qty: 2 }] }), 6000);
assert.equal(total({ code: 'SAVE10', items: [{ sku: 'NB-01', price: 400, qty: 25 }] }), 9000);
