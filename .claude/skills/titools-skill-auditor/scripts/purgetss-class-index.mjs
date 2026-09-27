#!/usr/bin/env node
/**
 * Regenerates the PurgeTSS class indexes from the generated `utilities.tss`.
 *
 * The three index references were written by hand and drifted into prefixes the
 * generator never emits (`row-height-*` for `row-h-*`, `background-disabled-*`
 * for `bg-disabled-*`) and Tailwind names PurgeTSS never had (`border-t-*`,
 * `p-1/2`). Reading the file the CLI ships means the index cannot disagree with it.
 *
 *   node .claude/skills/titools-skill-auditor/scripts/purgetss-class-index.mjs          # dry run: counts only
 *   node .claude/skills/titools-skill-auditor/scripts/purgetss-class-index.mjs --write  # rewrite the indexes
 *   node .claude/skills/titools-skill-auditor/scripts/purgetss-class-index.mjs --tss <path>
 *
 * Writes:
 *   skills/purgetss/references/class-index-properties.md  (whole file)
 *   skills/purgetss/references/class-categories.md        (whole file)
 *   skills/purgetss/references/class-index.md             (only between GENERATED markers)
 *
 * Run `node scripts/generate-toc.mjs --write` afterwards to refresh the tables of contents.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const tssPath = args.includes('--tss') ? args[args.indexOf('--tss') + 1] : '.purgetss-source/dist/utilities.tss';
const write = args.includes('--write');
const REFS = 'skills/purgetss/references';

const source = readFileSync(tssPath, 'utf8');
const version = JSON.parse(readFileSync('.purgetss-source/package.json', 'utf8')).version;

// ---------------------------------------------------------------------------
// Parse

/** Splits `{ a: 1, b: { c: 2 } }` into top-level [key, rawValue] pairs. */
function topLevel(obj) {
  const body = obj.trim().replace(/^\{/, '').replace(/\}$/, '');
  const pairs = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i <= body.length; i++) {
    const ch = body[i];
    if (quote) {
      if (ch === quote && body[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') quote = ch;
    else if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;
    else if ((ch === ',' && depth === 0) || i === body.length) {
      const part = body.slice(start, i).trim();
      start = i + 1;
      if (!part) continue;
      const colon = part.indexOf(':');
      pairs.push([part.slice(0, colon).trim().replace(/^['"]|['"]$/g, ''), part.slice(colon + 1).trim()]);
    }
  }
  return pairs;
}

// `font` and `animationProperties` are containers: the property a class sets is
// the key inside them (`font.fontSize`), not the container itself.
const CONTAINERS = new Set(['font', 'animationProperties']);

function propertiesOf(obj) {
  const props = [];
  for (const [key, value] of topLevel(obj)) {
    if (CONTAINERS.has(key) && value.startsWith('{')) {
      for (const [sub] of topLevel(value)) props.push(`${key}.${sub}`);
    } else {
      props.push(key);
    }
  }
  return props;
}

function leafValues(obj) {
  const out = [];
  for (const [, value] of topLevel(obj)) {
    if (value.startsWith('{')) out.push(...leafValues(value));
    else out.push(value);
  }
  return out;
}

function kindOf(obj) {
  const values = leafValues(obj);
  if (values.every((v) => v === 'true' || v === 'false')) return 'boolean';
  if (values.some((v) => /^'(#[0-9a-fA-F]{3,8}|transparent)'$/.test(v))) return 'color';
  if (values.every((v) => /^(-?[\d.]+|'-?[\d.]+%'|Ti\.UI\.(SIZE|FILL))$/.test(v))) return 'dimension';
  return 'constant';
}

const blocks = [];
let current = null;
for (const line of source.split('\n')) {
  if (line.trim() === '') {
    current = null;
    continue;
  }
  if (line.startsWith('//')) {
    if (!current || current.classes.length) {
      current = { comments: [], components: '', classes: [] };
      blocks.push(current);
    }
    current.comments.push(line.replace(/^\/\/\s?/, ''));
    const comp = /^\/\/ Component\(s\):\s*(.*)$/.exec(line);
    if (comp) current.components = comp[1].trim();
    continue;
  }
  const m = /^'\.([^'[]+)((?:\[[^\]]+\])*)':\s*(\{.*\})\s*$/.exec(line);
  if (!m) continue; // Ti Elements ('View', 'Window') are resets, not classes
  if (!current) {
    current = { comments: [], components: '', classes: [] };
    blocks.push(current);
  }
  const platform = (/\[platform=(\w+)\]/.exec(m[2]) || [])[1] || '';
  current.classes.push({ name: m[1], platform, props: propertiesOf(m[3]), kind: kindOf(m[3]), body: m[3] });
}

const classBlocks = blocks.filter((b) => b.classes.length);
const allNames = new Set(classBlocks.flatMap((b) => b.classes.map((c) => c.name)));

// ---------------------------------------------------------------------------
// Families: one block of the tss, named by the dash-segments its classes share

// One block can hold several stems (`p-*`, `px-*`, `pt-*` set the same property),
// so group by first segment before looking for a shared stem.
function stemOf(names) {
  if (names.length <= 6) return names.map((n) => `\`${n}\``);
  const split = names.map((n) => n.split('-'));
  const common = [];
  for (let i = 0; ; i++) {
    const seg = split[0][i];
    if (seg === undefined || !split.every((s) => s[i] === seg)) break;
    common.push(seg);
  }
  if (common.length && common.join('') !== '') {
    const stem = common.join('-');
    // The stem can itself be a class (`rounded` beside `rounded-lg`, `bg-linear` beside `bg-linear-to-t`).
    return names.includes(stem) ? [`\`${stem}\``, `\`${stem}-*\``] : [`\`${stem}-*\``];
  }
  return names.map((n) => `\`${n}\``);
}

function family(block) {
  const names = [...new Set(block.classes.map((c) => c.name))];
  const groups = new Map();
  for (const n of names) {
    const key = n.startsWith('-') ? `-${n.split('-')[1]}` : n.split('-')[0];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(n);
  }
  const parts = [...groups.values()].flatMap(stemOf);
  return parts.length > 8 ? `${parts.slice(0, 8).join(', ')}, …` : parts.join(', ');
}

function examples(block, n = 2) {
  const names = [...new Set(block.classes.map((c) => c.name))];
  if (names.length <= 3) return '';
  const pick = [names[0], names[Math.floor(names.length / 2)], names[names.length - 1]];
  return [...new Set(pick)].slice(0, n + 1).map((x) => `\`${x}\``).join(', ');
}

function platforms(block) {
  const set = new Set(block.classes.map((c) => c.platform));
  if (set.size === 1 && set.has('')) return '';
  if (set.has('')) return 'some variants platform-only';
  return [...set].map((p) => (p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : p)).join(', ') + ' only';
}

// Some blocks list 40 components; past four the cell stops being readable.
function shortComponents(s) {
  const list = s.replace(/\s*-\s*(iOS|Android) Only$/i, '').split(',').map((c) => c.trim().replace(/^Ti\.UI\./, '')).filter(Boolean);
  return list.length > 4 ? `${list.slice(0, 3).join(', ')} +${list.length - 3} more` : list.join(', ');
}

function blockKind(block) {
  const counts = {};
  for (const c of block.classes) counts[c.kind] = (counts[c.kind] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function blockProps(block) {
  return [...new Set(block.classes.flatMap((c) => c.props))];
}

// ---------------------------------------------------------------------------
// Counts

const uniqueClasses = allNames.size;
const prefixes = [...new Set([...allNames].map((n) => n.replace(/^-/, '').split('-')[0]))].sort();
const byProp = new Map();
for (const block of classBlocks) {
  for (const prop of blockProps(block)) {
    if (!byProp.has(prop)) byProp.set(prop, []);
    byProp.get(prop).push(block);
  }
}
const properties = [...byProp.keys()].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

// ---------------------------------------------------------------------------
// class-index-properties.md

const RANGES = [['A', 'C'], ['D', 'H'], ['I', 'O'], ['P', 'S'], ['T', 'Z']];
const row = (cells) => `| ${cells.join(' | ')} |`;

function propertiesFile() {
  const out = [];
  out.push('# PurgeTSS Class Index — Titanium Properties (A–Z)');
  out.push('');
  out.push(`Every Titanium property that has PurgeTSS utility classes, with the classes that set it. Generated from \`utilities.tss\` (PurgeTSS ${version}) by \`.claude/skills/titools-skill-auditor/scripts/purgetss-class-index.mjs\`; do not edit by hand. For naming rules and verification commands see [class-index.md](./class-index.md); for classes grouped by kind of value see [class-categories.md](./class-categories.md).`);
  out.push('');
  out.push('> Before suggesting ANY class, verify it exists: `grep -E "PATTERN" ./purgetss/styles/utilities.tss`');
  out.push('');
  out.push('<!-- TOC-START -->');
  out.push('<!-- TOC-END -->');
  out.push('');
  out.push(`## ${properties.length} Titanium Properties with Classes`);
  out.push('');
  out.push('A property set inside `font` or `animationProperties` is listed with its container (`font.fontSize`). A class that sets several properties appears under each of them. **Classes** shows the family as it appears in `utilities.tss`: `name-*` when the classes share that stem, otherwise the class names themselves. **Count** is the number of distinct class names in that family.');
  for (const [from, to] of RANGES) {
    const inRange = properties.filter((p) => {
      const c = p[0].toUpperCase();
      return c >= from && c <= to;
    });
    if (!inRange.length) continue;
    out.push('');
    out.push(`### ${from}–${to}`);
    out.push('');
    out.push(row(['Property', 'Classes', 'Count', 'Components', 'Platform']));
    out.push(row(['---', '---', '---', '---', '---']));
    for (const prop of inRange) {
      for (const block of byProp.get(prop)) {
        const count = new Set(block.classes.map((c) => c.name)).size;
        out.push(row([`\`${prop}\``, family(block), String(count), shortComponents(block.components) || '—', platforms(block) || '—']));
      }
    }
  }
  out.push('');
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// class-categories.md

const KIND_TITLES = {
  color: 'Color families',
  dimension: 'Dimension families (sizes, spacing, positions)',
  constant: 'Constant families (one Titanium constant or fixed value per class)',
  boolean: 'Boolean families'
};

function categoriesFile() {
  const out = [];
  out.push('# PurgeTSS Class Categories');
  out.push('');
  out.push(`Every class family in \`utilities.tss\` (PurgeTSS ${version}), grouped by the kind of value it sets. Generated by \`.claude/skills/titools-skill-auditor/scripts/purgetss-class-index.mjs\`; do not edit by hand. For the property-by-property table see [class-index-properties.md](./class-index-properties.md); for naming rules see [class-index.md](./class-index.md).`);
  out.push('');
  out.push('<!-- TOC-START -->');
  out.push('<!-- TOC-END -->');

  const groups = { color: [], dimension: [], constant: [], boolean: [] };
  for (const block of classBlocks) groups[blockKind(block)].push(block);

  // Colors: every family carries the same palette, so list stems rather than one row each.
  out.push('');
  out.push(`## ${KIND_TITLES.color}`);
  out.push('');
  // `bg-selected-red-500` also ends in a shade; only a one-word hue after `bg-` is a palette color.
  const palette = [...allNames].map((n) => /^bg-([a-z]+)-500$/.exec(n)).filter(Boolean).map((m) => m[1]);
  out.push(`${groups.color.length} families. Each takes every color in the palette — \`black\`, \`white\`, \`transparent\` and ${palette.length} hues (${palette.map((p) => `\`${p}\``).join(', ')}) in shades \`50\` to \`950\` — plus any color defined in \`config.cjs\`. Append the color to the stem: \`bg-red-500\`, \`title-sky-700\`.`);
  out.push('');
  out.push(row(['Stem', 'Property', 'Components']));
  out.push(row(['---', '---', '---']));
  for (const block of groups.color.sort((a, b) => family(a).localeCompare(family(b)))) {
    out.push(row([family(block), blockProps(block).map((p) => `\`${p}\``).join(', '), shortComponents(block.components) || '—']));
  }

  for (const kind of ['dimension', 'constant']) {
    out.push('');
    out.push(`## ${KIND_TITLES[kind]}`);
    out.push('');
    out.push(row(['Family', 'Count', 'Property', 'Examples']));
    out.push(row(['---', '---', '---', '---']));
    for (const block of groups[kind].sort((a, b) => family(a).localeCompare(family(b)))) {
      const count = new Set(block.classes.map((c) => c.name)).size;
      out.push(row([family(block), String(count), blockProps(block).map((p) => `\`${p}\``).join(', '), examples(block) || '—']));
    }
  }

  out.push('');
  out.push(`## ${KIND_TITLES.boolean}`);
  out.push('');
  out.push('Each sets one property to `true` or `false`. Most come as a pair, `name` and `name-false`.');
  out.push('');
  const pairs = groups.boolean
    .map((block) => [...new Set(block.classes.map((c) => c.name))].map((n) => `\`${n}\``).join(' / '))
    .sort();
  for (const p of pairs) out.push(`- ${p}`);
  out.push('');
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// class-index.md: counts and prefix list between markers

function kebab(prop) {
  return prop.replace(/^(font|animationProperties)\./, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function irregularTable() {
  // Families whose stem is not the property in kebab-case: the names an agent cannot derive.
  const rows = [];
  for (const block of classBlocks) {
    const props = blockProps(block);
    const fam = family(block);
    const stem = fam.replace(/`/g, '').replace(/-\*$/, '');
    if (props.some((p) => stem.startsWith(kebab(p)) || kebab(p).startsWith(stem))) continue;
    rows.push(row([fam, props.map((p) => `\`${p}\``).join(', '), shortComponents(block.components) || '—']));
  }
  return [row(['Classes', 'Property', 'Components']), row(['---', '---', '---']), ...[...new Set(rows)].sort()].join('\n');
}

const MARK = (name) => [`<!-- GENERATED:${name} START -->`, `<!-- GENERATED:${name} END -->`];

function replaceRegion(text, name, body) {
  const [start, end] = MARK(name);
  const i = text.indexOf(start);
  const j = text.indexOf(end);
  if (i === -1 || j === -1) throw new Error(`class-index.md is missing the ${start} / ${end} markers`);
  return `${text.slice(0, i + start.length)}\n${body}\n${text.slice(j)}`;
}

function wrapList(items, width = 100) {
  const lines = [];
  let line = '';
  for (const item of items) {
    const next = line ? `${line}, ${item}` : item;
    if (next.length > width) {
      lines.push(`${line},`);
      line = item;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.join('\n');
}

function classIndex(text) {
  text = replaceRegion(text, 'counts', `**Generated from \`utilities.tss\` (PurgeTSS ${version}): ${uniqueClasses.toLocaleString('en-US')} unique classes, ${prefixes.length} first segments, ${properties.length} Titanium properties.** Counts grow with each Titanium SDK and icon-font release.`);
  text = replaceRegion(text, 'irregular', irregularTable());
  text = replaceRegion(text, 'prefixes', `\`\`\`\n${wrapList(prefixes)}\n\`\`\``);
  return text;
}

// ---------------------------------------------------------------------------

console.log(`utilities.tss: ${tssPath} (PurgeTSS ${version})`);
console.log(`blocks with classes: ${classBlocks.length}`);
console.log(`unique classes: ${uniqueClasses}`);
console.log(`first segments: ${prefixes.length}`);
console.log(`properties: ${properties.length}`);

if (write) {
  writeFileSync(`${REFS}/class-index-properties.md`, propertiesFile());
  writeFileSync(`${REFS}/class-categories.md`, categoriesFile());
  const indexPath = `${REFS}/class-index.md`;
  writeFileSync(indexPath, classIndex(readFileSync(indexPath, 'utf8')));
  console.log('written: class-index-properties.md, class-categories.md, class-index.md');
} else {
  console.log('dry run — pass --write to rewrite the indexes');
}
