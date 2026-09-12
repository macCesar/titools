#!/usr/bin/env node
/**
 * Derives the ti-api reference map from the reference files themselves.
 *
 * Hand-written mappings drift and then lie: an audit run against the wrong file
 * reports every member of a type as missing. Read the `## Ti.X` headings instead
 * and the map cannot disagree with the files.
 *
 *   node .claude/skills/titools-skill-auditor/scripts/api-map.mjs            # type -> reference
 *   node .claude/skills/titools-skill-auditor/scripts/api-map.mjs --by-file  # reference -> types
 *   node .claude/skills/titools-skill-auditor/scripts/api-map.mjs --find Toolbar
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'skills/ti-api/references';
const byType = new Map();
const byFile = new Map();

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
  const types = [];
  for (const line of readFileSync(join(dir, file), 'utf8').split('\n')) {
    const h = /^##\s+((?:Ti|Titanium|Modules|Global)[.\w]*)\s*$/.exec(line);
    if (!h) continue;
    const type = h[1].replace(/^Ti\./, 'Titanium.');
    types.push(type);
    if (!byType.has(type)) byType.set(type, []);
    byType.get(type).push(file);
  }
  byFile.set(file, types);
}

const args = process.argv.slice(2);
const find = args.includes('--find') ? args[args.indexOf('--find') + 1] : null;

if (find) {
  const hits = [...byType].filter(([t]) => t.toLowerCase().includes(find.toLowerCase()));
  if (hits.length === 0) console.log(`no reference documents a type matching "${find}"`);
  for (const [type, files] of hits) console.log(`${type}  ->  ${files.join(', ')}`);
} else if (args.includes('--by-file')) {
  for (const [file, types] of byFile) console.log(`\n${file}  (${types.length})\n  ${types.join('\n  ')}`);
} else {
  for (const [type, files] of [...byType].sort()) {
    console.log(`${files.length > 1 ? 'DUP ' : '    '}${type}  ->  ${files.join(', ')}`);
  }
  console.log(`\n${byType.size} types across ${byFile.size} reference files`);
}
