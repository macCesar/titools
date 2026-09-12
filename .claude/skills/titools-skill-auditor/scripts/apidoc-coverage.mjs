#!/usr/bin/env node
/**
 * Coverage check for `ti-api`: which apidoc members does a reference file not name?
 *
 * Names only. It cannot tell you a documented signature is wrong, only that a
 * member exists upstream and the reference never mentions it. Every hit needs
 * reading before it becomes a change — a member can be deliberately omitted.
 *
 *   node .claude/skills/titools-skill-auditor/scripts/apidoc-coverage.mjs \
 *     --ref skills/ti-api/references/api-ui-windows-navigation.md \
 *     --yml Titanium/UI/Toolbar.yml Titanium/UI/Window.yml \
 *     [--tag 13_4_1_GA]
 *
 * Without --tag it reads the working tree, which tracks main and carries
 * unreleased APIs. Anchor to the newest GA unless you mean to look ahead.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const take = (flag) => {
  const i = args.indexOf(flag);
  if (i === -1) return [];
  const out = [];
  for (let j = i + 1; j < args.length && !args[j].startsWith('--'); j++) out.push(args[j]);
  return out;
};

const [ref] = take('--ref');
const ymls = take('--yml');
const [tag] = take('--tag');
const sdk = take('--sdk')[0] ?? '.titanium-sdk';

if (!ref || ymls.length === 0) {
  console.error('usage: --ref <file.md> --yml <path.yml>... [--tag <GA tag>] [--sdk <dir>]');
  process.exit(1);
}

const readYml = (rel) => {
  const path = `apidoc/${rel}`;
  if (tag) return execFileSync('git', ['-C', sdk, 'show', `${tag}:${path}`], { encoding: 'utf8' });
  return readFileSync(`${sdk}/${path}`, 'utf8');
};

/**
 * Members of the apidoc document named by `wanted`.
 *
 * Two traps, both of which inflate the count into nonsense if ignored. A file
 * holds several documents separated by `---`, so `Titanium/UI/View.yml` also
 * carries `Gradient`, whose `colors` and `startPoint` are not members of View.
 * And an event's payload is a nested `properties:` list, so a naive scan reads
 * `obscured` five times as five events. Only `- name:` entries at the shallowest
 * indentation inside a section belong to the type.
 */
function members(text, wanted) {
  const docs = text.split(/^---\s*$/m);
  const doc = docs.find((d) => new RegExp(`^name:\\s*${wanted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm').test(d)) ?? docs[0];

  const out = { properties: [], methods: [], events: [] };
  const deprecated = new Set();
  let section = null;
  let depth = null;
  let current = null;

  for (const line of doc.split('\n')) {
    if (/^(properties|methods|events):\s*$/.test(line)) {
      section = /^(\w+):/.exec(line)[1];
      depth = null;
      current = null;
      continue;
    }
    if (/^\S/.test(line) && line.trim() !== '') { section = null; continue; }
    if (!section) continue;

    const entry = /^(\s*)-\s+name:\s*(\S+)/.exec(line);
    if (!entry) {
      if (current && depth !== null && new RegExp(`^\\s{${depth + 2}}deprecated:`).test(line)) deprecated.add(current);
      continue;
    }
    const indent = entry[1].length;
    if (depth === null) depth = indent;
    if (indent > depth) continue; // an event payload or a nested dictionary
    current = entry[2];
    out[section].push(current);
  }
  return { ...out, deprecated };
}

const refText = readFileSync(ref, 'utf8');
const named = (name) => new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(refText);

let total = 0, missing = 0;
for (const rel of ymls) {
  let text;
  try { text = readYml(rel); } catch { console.log(`\n  ${rel}  — not present${tag ? ` at ${tag}` : ''}`); continue; }
  const m = members(text, rel.replace(/\.yml$/, '').replace(/\//g, '.'));
  const gaps = [];
  for (const kind of ['properties', 'methods', 'events']) {
    for (const name of m[kind]) {
      total++;
      if (!named(name)) { missing++; gaps.push(`${({properties:'property',methods:'method',events:'event'})[kind]} ${name}${m.deprecated.has(name) ? ' (deprecated)' : ''}`); }
    }
  }
  console.log(`\n${rel}  ${m.properties.length}p ${m.methods.length}m ${m.events.length}e`);
  if (gaps.length === 0) console.log('  all named in the reference');
  else for (const g of gaps) console.log(`  MISSING  ${g}`);
}
console.log(`\n${total - missing}/${total} members named${tag ? `  (apidoc @ ${tag})` : '  (apidoc @ working tree)'}`);
