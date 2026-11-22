#!/usr/bin/env node
// Checks every skill for valid frontmatter, size, working relative links, and preserved credit.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = join(root, 'skills');
// Same limit as superpowers' skill-size test: hosts can truncate long skills after compaction.
const maxSkillBytes = 20_000;
const skipDirs = new Set(['.git', 'node_modules', '.runs']);
const errors = [];
const fail = (path, message) => errors.push(`${relative(root, path)}: ${message}`);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function frontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return null;
  const fields = {};
  for (const line of text.slice(4, end).split('\n')) {
    const match = line.match(/^([a-z][a-z0-9-]*):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    fields[match[1]] = value;
  }
  return fields;
}

function prose(text) {
  return text
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, '')
    .replace(/`[^`\n]*`/g, '');
}

function comments(text) {
  return [...text.matchAll(/<!--([\s\S]*?)-->/g)].map(match => match[1]);
}

const isInside = (path, dir) => path === dir || path.startsWith(dir + sep);

for (const name of readdirSync(skillsRoot).sort()) {
  const dir = join(skillsRoot, name);
  if (!statSync(dir).isDirectory()) continue;
  const skillFile = join(dir, 'SKILL.md');
  if (!existsSync(skillFile)) {
    fail(dir, 'missing SKILL.md');
    continue;
  }

  const text = readFileSync(skillFile, 'utf8');
  const bytes = Buffer.byteLength(text);
  if (bytes >= maxSkillBytes) fail(skillFile, `${bytes} bytes; move occasional detail into references/ (limit ${maxSkillBytes})`);

  const fields = frontmatter(text);
  if (!fields) {
    fail(skillFile, 'missing --- frontmatter block');
  } else {
    if (fields.name !== name) fail(skillFile, `name "${fields.name ?? ''}" must match its folder "${name}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) fail(skillFile, 'name must be lowercase-hyphenated and at most 64 characters');
    const description = fields.description ?? '';
    if (!description) fail(skillFile, 'missing description');
    if (description.length > 1024) fail(skillFile, `description is ${description.length} characters (limit 1024)`);
    if (/[<>]/.test(description)) fail(skillFile, 'description must not contain angle brackets');
    const gate = fields['disable-model-invocation'];
    if (gate !== undefined && gate !== 'true' && gate !== 'false') fail(skillFile, 'disable-model-invocation must be true or false');
  }

  const notes = walk(dir).filter(path => path.endsWith('.md')).flatMap(path => comments(readFileSync(path, 'utf8')));
  const credits = notes.filter(note => /\b(Adapted from|Inspired by|Includes|From)\b|\(MIT\)|MIT licen[cs]e/.test(note));
  const license = join(dir, 'LICENSE');
  if (existsSync(license)) {
    const holder = readFileSync(license, 'utf8').match(/^Copyright \(c\) [\d\s,-]*(?:PRESENT\s+)?([^<\n]+?)\s*(?:<.*)?$/m)?.[1];
    if (!holder) fail(license, 'cannot read the copyright holder');
    else if (!credits.some(note => note.includes(holder))) fail(dir, `ships a LICENSE for ${holder} but no credit comment names them`);
  } else if (credits.length > 0) {
    fail(dir, 'credits another source but does not ship its LICENSE');
  }
}

for (const file of walk(root).filter(path => path.endsWith('.md'))) {
  for (const match of prose(readFileSync(file, 'utf8')).matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = match[1].replace(/#.*$/, '');
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const resolved = resolve(dirname(file), decodeURIComponent(target));
    if (!existsSync(resolved)) fail(file, `broken link ${match[1]}`);
    else if (isInside(file, skillsRoot) && !isInside(resolved, skillsRoot)) fail(file, `link ${match[1]} leaves skills/, so it breaks when skills are installed as sibling symlinks`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log('All skills pass.');
