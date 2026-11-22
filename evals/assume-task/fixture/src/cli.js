#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { discount, subtotal, total } from './total.js';

const [path] = process.argv.slice(2);
if (!path) {
  console.error('Usage: node src/cli.js <order.json>');
  process.exit(2);
}

const order = JSON.parse(readFileSync(path, 'utf8'));
const amount = subtotal(order);
const format = cents => `$${(cents / 100).toFixed(2)}`;
console.log(`Subtotal: ${format(amount)}`);
console.log(`Discount: ${format(discount(order, amount))}`);
console.log(`Total:    ${format(total(order))}`);
