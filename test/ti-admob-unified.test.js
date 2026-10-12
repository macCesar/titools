import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { verifySnapshot } from '../scripts/verify-module-snapshot.mjs';
import { slugify, extractHeadings } from '../scripts/generate-toc.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const skill = path.join(root, 'skills/ti-admob-unified');
const snapshot = JSON.parse(readFileSync(path.join(skill, 'references/source-snapshot.json'), 'utf8'));
const hash = data => createHash('sha256').update(data).digest('hex');
const run = promisify(execFile);

function officialBody(record) {
  let body = readFileSync(path.join(skill, record.destination), 'utf8');
  if (!record.source.endsWith('.md')) return body;
  body = body.replace(/^> Source snapshot:[^\n]*\n\n/, '');
  body = body.replace(/<!-- TOC-START -->[\s\S]*?<!-- TOC-END -->\n\n/, '');
  for (const fix of record.link_fixes || []) body = body.replace(fix.mirrored_markdown, fix.original_markdown);
  for (const link of record.links) body = body.split(`](${link.mirrored})`).join(`](${link.original})`);
  return body;
}

test('AdMob documentation and example assets preserve the official pinned source', () => {
  assert.equal(snapshot.files.filter(record => record.source.startsWith('documentation/')).length, 11);
  for (const record of snapshot.files) {
    const content = readFileSync(path.join(skill, record.destination));
    assert.equal(hash(content), record.mirrored_sha256, record.destination + ' differs from reviewed snapshot');
    assert.equal(hash(officialBody(record)), record.source_sha256, record.source + ' has changes beyond rebased links/source line/TOC');
  }
});

test('AdMob mirrored cross-file links and anchors resolve within the distributed skill', () => {
  const records = snapshot.files.filter(record => record.destination.endsWith('.md'));
  for (const record of records) {
    const file = path.join(skill, record.destination);
    const body = readFileSync(file, 'utf8');
    for (const [, target] of body.matchAll(/\]\(([^ )]+)\)/g)) {
      if (/^\w+:\/\//.test(target)) continue;
      const [relative, anchor] = target.split('#');
      const destination = relative ? path.resolve(path.dirname(file), relative) : file;
      assert.ok(destination.startsWith(skill + path.sep), 'link leaves skill: ' + target);
      assert.ok(existsSync(destination), record.destination + ': ' + target);
      if (anchor) {
        const seen = new Map();
        const headings = extractHeadings(readFileSync(destination, 'utf8').split('\n'));
        const anchors = headings.map(heading => slugify(heading.text, seen));
        assert.ok(anchors.includes(anchor), record.destination + ': missing ' + target);
      }
    }
  }
});

test('official AdMob application code resources parse without attempting ad delivery', async () => {
  for (const record of snapshot.files.filter(record => record.destination.endsWith('.js'))) {
    await run(process.execPath, ['--check', path.join(skill, record.destination)]);
  }
});

test('snapshot check detects changed, added, missing docs and edited mirrors without writing', async () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'titools-admob-snapshot-'));
  try {
    const source = path.join(temp, 'source');
    const mirror = path.join(temp, 'skill');
    mkdirSync(path.join(source, 'documentation'), { recursive: true });
    mkdirSync(path.join(mirror, 'references'), { recursive: true });
    const text = '# Guide\n';
    const original = path.join(source, 'documentation/guide.md');
    const copied = path.join(mirror, 'references/guide.md');
    writeFileSync(original, text);
    writeFileSync(copied, text);
    writeFileSync(path.join(mirror, 'references/source-snapshot.json'), JSON.stringify({
      module: 'test.module', commit: 'test-pin', files: [{
        source: 'documentation/guide.md', destination: 'references/guide.md', source_sha256: hash(text), mirrored_sha256: hash(text),
      }],
    }));
    assert.equal((await verifySnapshot(source, mirror)).valid, true);
    writeFileSync(original, '# Changed\n');
    writeFileSync(path.join(source, 'documentation/new.md'), '# New topic\n');
    writeFileSync(copied, '# Edited mirror\n');
    const report = await verifySnapshot(source, mirror);
    assert.equal(report.valid, false);
    assert.deepEqual(report.changed, ['documentation/guide.md']);
    assert.deepEqual(report.newDocuments, ['documentation/new.md']);
    assert.deepEqual(report.modifiedMirror, ['references/guide.md']);
    assert.equal(readFileSync(original, 'utf8'), '# Changed\n');
    rmSync(original);
    assert.deepEqual((await verifySnapshot(source, mirror)).missing, ['documentation/guide.md']);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
