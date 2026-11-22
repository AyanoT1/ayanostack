import assert from 'node:assert/strict';
import { test } from 'node:test';
import { total } from '../src/total.js';

test('applies SAVE10 at or above $100', () => {
  assert.equal(total({ code: 'SAVE10', items: [{ sku: 'DESK-01', price: 12000, qty: 1 }] }), 10800);
});

test('does not apply SAVE10 below $100', () => {
  assert.equal(total({ code: 'SAVE10', items: [{ sku: 'LAMP-03', price: 6000, qty: 1 }] }), 6000);
});
