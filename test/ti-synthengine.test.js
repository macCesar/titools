import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import vm from 'node:vm';
import { fingerprintWorktree, verifySnapshot } from '../scripts/verify-module-snapshot.mjs';
import { slugify, extractHeadings } from '../scripts/generate-toc.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const skill = path.join(root, 'skills/ti-synthengine');
const read = file => readFileSync(file, 'utf8');
const hash = body => createHash('sha256').update(body).digest('hex');
const snapshotPath = path.join(root, 'scripts/snapshots/ti-synthengine.json');
const run = promisify(execFile);

test('synthesis mirrors reconstruct their pinned official sources with recorded navigation fixes', () => {
  const snapshot = JSON.parse(read(snapshotPath));
  assert.ok(snapshot.files.some(record => record.source === 'documentation/sound-api.md'));
  assert.ok(snapshot.files.some(record => record.source === 'documentation/upgrade-2.0.0.md'));
  assert.equal(snapshot.files.filter(record => record.kind === 'declaration-asset').length, 1);
  assert.match(snapshot.commit, /^[a-f0-9]{40}$/);
  for (const record of snapshot.files) {
    const bytes = readFileSync(path.join(skill, record.destination));
    const text = bytes.toString('utf8');
    assert.equal(hash(bytes), record.mirrored_sha256, record.destination + ' changed after review');
    if (record.destination.endsWith('.json') || record.destination.endsWith('.js') || record.destination.endsWith('.ts') || record.destination.endsWith('.zip')) {
      if (record.destination.endsWith('.json')) assert.doesNotThrow(() => JSON.parse(text));
      assert.equal(hash(bytes), record.source_sha256, record.destination + ' must remain byte-identical');
      continue;
    }
    assert.ok(text.startsWith('> Source snapshot:') && text.split('\n')[0].includes(snapshot.commit));
    assert.ok(text.split('\n')[0].includes(record.source_sha256));
    if (snapshot.source_state === 'working-tree') {
      assert.match(text.split('\n')[0], /working[ -]tree/i, 'dirty sources must not be presented as committed');
    }
    const parts = record.source_parts || [record.destination];
    let body = parts.map(part => read(path.join(skill, part))
      .replace(/^> Source snapshot:[^\n]*\n\n/, '')
      .replace(/<!-- TOC-START -->[\s\S]*?<!-- TOC-END -->\n\n/, '')).join('');
    const fixes = snapshot.files.filter(part => part.source === record.source)
      .flatMap(part => part.link_fixes || []);
    for (const fix of fixes.slice().reverse()) {
      assert.equal(body.split(fix.mirrored_markdown).length, 2, 'each recorded fix occurs exactly once');
      body = body.replace(fix.mirrored_markdown, fix.original_markdown);
    }
    assert.equal(hash(body), record.source_sha256, record.destination + ' has unrecorded source changes');
  }
});

test('distributed synthesis resources omit maintainer reports and contain every demo dependency', () => {
  function files(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const target = path.join(dir, entry.name);
      return entry.isDirectory() ? files(target) : [target];
    });
  }
  const resources = files(skill);
  assert.deepEqual(resources.filter(file => /\.(?:zip|json)$/i.test(file)), [],
    'raw evidence and snapshot metadata belong outside the distributed skill');
  for (const file of resources.filter(file => file.endsWith('.js'))) {
    for (const [, dependency] of read(file).matchAll(/require\(['"](lib\/[^'"]+)['"]\)/g)) {
      assert.ok(existsSync(path.join(skill, 'assets/example', dependency + '.js')), dependency + ' required by ' + file);
    }
  }
});

test('bundled synthesis demo accepts the published 2.0 metadata before building its UI', () => {
  const synth = {
    getContract: () => ({ version: '2.0.0', limits: { spatialX: {}, spatialY: {} }, waveTypes: {} }),
    getDefaults: () => ({ version: '2.0.0', limits: { spatialX: {}, spatialY: {} }, waveTypes: {} }),
  };
  for (const name of ['getStats', 'resetStats', 'enableStats', 'disableStats', 'createSound']) synth[name] = () => {};
  const app = read(path.join(skill, 'assets/example/app.js'));
  const setup = app.slice(0, app.indexOf('var WAVE ='));
  assert.doesNotThrow(() => vm.runInNewContext(setup, {
    require: name => name === 'ti.synthengine' ? synth : () => ({}),
    onSequenceEnd() {}, // Declared later and hoisted when the complete app runs.
  }));
});

test('synthesis links resolve in the distributed skill and curated recipes retain their entry points', () => {
  const files = [path.join(skill, 'SKILL.md'), path.join(skill, 'assets/example/README.md'), ...readdirSync(path.join(skill, 'references'))
    .filter(name => name.endsWith('.md')).map(name => path.join(skill, 'references', name))];
  for (const file of files) {
    let fenced = false;
    for (const line of read(file).split('\n')) {
      if (/^\s*(?:```+|~~~+)/.test(line)) { fenced = !fenced; continue; }
      if (fenced) continue;
      for (const [, href] of line.matchAll(/\]\(([^ )]+)\)/g)) {
        if (/^[a-z][a-z\d+.-]*:/i.test(href)) continue;
        const [relative, anchor] = href.split('#');
        const target = relative ? path.resolve(path.dirname(file), decodeURIComponent(relative)) : file;
        assert.ok(target.startsWith(skill + path.sep), 'link leaves distributed skill: ' + href);
        assert.ok(existsSync(target), path.relative(skill, file) + ' links to missing ' + href);
        if (anchor) {
          const seen = new Map();
          const anchors = extractHeadings(read(target).split('\n')).map(heading => slugify(heading.text, seen));
          assert.ok(anchors.includes(decodeURIComponent(anchor)), path.relative(skill, file) + ': missing ' + href);
        }
      }
    }
  }
  for (const name of ['examples.md', 'sound-design.md']) {
    assert.match(read(path.join(skill, 'references', name)), /\]\(recipes\.md(?:#[^)]+)?\)/,
      name + ' must keep its curated recipe navigation');
  }
});

test('reviewed upstream exclusions detect changes, missing files and newly added documents', async () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'titools-synth-snapshot-'));
  try {
    const source = path.join(temp, 'source');
    const mirror = path.join(temp, 'skill');
    mkdirSync(path.join(source, 'documentation'), { recursive: true });
    mkdirSync(path.join(mirror, 'references'), { recursive: true });
    const guide = '# Guide\n';
    const notice = '# Notices\n';
    const metadata = path.join(temp, 'snapshot.json');
    const check = () => verifySnapshot(source, mirror, metadata);
    writeFileSync(path.join(source, 'documentation/guide.md'), guide);
    writeFileSync(path.join(mirror, 'references/guide.md'), guide);
    const excluded = path.join(source, 'documentation/third-party-notices.md');
    writeFileSync(excluded, notice);
    writeFileSync(metadata, JSON.stringify({
      module: 'ti.synthengine', commit: 'test-pin', files: [{
        source: 'documentation/guide.md', destination: 'references/guide.md',
        source_sha256: hash(guide), mirrored_sha256: hash(guide),
      }], excluded_documents: [{ source: 'documentation/third-party-notices.md',
        source_sha256: hash(notice), reason: 'License text remains in the official module.' }],
    }));
    assert.equal((await check()).valid, true);
    writeFileSync(excluded, '# Changed notices\n');
    assert.deepEqual((await check()).changed, ['documentation/third-party-notices.md']);
    rmSync(excluded);
    assert.deepEqual((await check()).missing, ['documentation/third-party-notices.md']);
    writeFileSync(path.join(source, 'documentation/new.md'), '# New\n');
    assert.deepEqual((await check()).newDocuments, ['documentation/new.md']);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test('reviewed working trees accept only their exact tracked and untracked state at the pinned HEAD', async () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'titools-synth-worktree-'));
  try {
    const source = path.join(temp, 'source');
    const mirror = path.join(temp, 'skill');
    mkdirSync(path.join(source, 'documentation'), { recursive: true });
    mkdirSync(path.join(mirror, 'references'), { recursive: true });
    const git = (...args) => run('git', args, { cwd: source });
    await git('init', '-q');
    await git('config', 'user.name', 'Snapshot Test');
    await git('config', 'user.email', 'snapshot@example.invalid');
    const guide = '# Guide\n';
    const tracked = path.join(source, 'native.cpp');
    const untracked = path.join(source, 'new native\nfile.cpp');
    writeFileSync(path.join(source, 'documentation/guide.md'), guide);
    writeFileSync(tracked, 'original\n');
    writeFileSync(path.join(source, '.gitignore'), 'ignored.txt\n');
    await git('add', '.');
    await git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'Fixture baseline');
    const commit = (await git('rev-parse', 'HEAD')).stdout.trim();
    writeFileSync(tracked, 'reviewed native change\n');
    // Stage part of the work so the fingerprint must include index and worktree.
    await git('add', 'native.cpp');
    writeFileSync(untracked, 'reviewed new source\n');
    writeFileSync(path.join(mirror, 'references/guide.md'), guide);
    const snapshot = {
      module: 'ti.synthengine', commit, source_state: 'working-tree',
      reviewed_worktree_sha256: await fingerprintWorktree(source),
      files: [{ source: 'documentation/guide.md', destination: 'references/guide.md',
        source_sha256: hash(guide), mirrored_sha256: hash(guide) }],
    };
    const metadata = path.join(mirror, 'references/source-snapshot.json');
    const save = value => writeFileSync(metadata, JSON.stringify(value));
    save(snapshot);
    let report = await verifySnapshot(source, mirror);
    assert.equal(report.valid, true);
    assert.equal(report.dirtySource, true);
    assert.equal(report.reviewedWorktreeMatch, true);
    assert.equal(await fingerprintWorktree(source), snapshot.reviewed_worktree_sha256);
    writeFileSync(path.join(source, 'ignored.txt'), 'ignored build output');
    assert.equal(await fingerprintWorktree(source), snapshot.reviewed_worktree_sha256);

    for (const [file, reviewed] of [[tracked, 'reviewed native change\n'], [untracked, 'reviewed new source\n']]) {
      writeFileSync(file, 'unreviewed drift\n');
      report = await verifySnapshot(source, mirror);
      assert.equal(report.reviewedWorktreeMatch, false);
      assert.equal(report.valid, false);
      writeFileSync(file, reviewed);
      rmSync(file);
      report = await verifySnapshot(source, mirror);
      assert.equal(report.reviewedWorktreeMatch, false);
      assert.equal(report.valid, false);
      writeFileSync(file, reviewed);
    }
    const added = path.join(source, 'another-untracked.cpp');
    writeFileSync(added, 'new unreviewed file');
    assert.equal((await verifySnapshot(source, mirror)).valid, false);
    rmSync(added);

    save({ ...snapshot, reviewed_worktree_sha256: undefined });
    report = await verifySnapshot(source, mirror);
    assert.equal(report.reviewedWorktreeMatch, false);
    assert.equal(report.valid, false);
    save({ ...snapshot, source_state: undefined, reviewed_worktree_sha256: undefined });
    report = await verifySnapshot(source, mirror);
    assert.equal(report.reviewedWorktreeMatch, null);
    assert.equal(report.valid, false, 'ordinary snapshots still reject a dirty source');

    save(snapshot);
    await git('-c', 'commit.gpgsign=false', 'commit', '--allow-empty', '-qm', 'Changed HEAD');
    // Re-record the current state to isolate HEAD drift from fingerprint drift.
    save({ ...snapshot, reviewed_worktree_sha256: await fingerprintWorktree(source) });
    report = await verifySnapshot(source, mirror);
    assert.equal(report.reviewedWorktreeMatch, true);
    assert.equal(report.commitReviewRequired, true);
    assert.equal(report.valid, false);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
