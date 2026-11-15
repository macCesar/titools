import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const script = fileURLToPath(new URL('../scripts/sync-tidev-skills.mjs', import.meta.url));
const names = ['ti-api', 'ti-guides', 'ti-howtos', 'alloy-guides', 'alloy-howtos'];
const git = async (cwd, ...args) => (await run('git', args, { cwd })).stdout.trim();

async function fixture(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'titools-sync-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const source = path.join(directory, 'source with spaces');
  const target = path.join(directory, 'target with spaces');
  for (const repo of [source, target]) {
    await fs.mkdir(repo);
    await git(repo, 'init', '-b', 'main');
    await git(repo, 'config', 'user.name', 'Fixture');
    await git(repo, 'config', 'user.email', 'fixture@example.invalid');
    await git(repo, 'config', 'core.hooksPath', path.join(directory, 'no-hooks'));
    await git(repo, 'config', 'commit.gpgsign', 'false');
    for (const name of names) {
      await fs.mkdir(path.join(repo, 'skills', name), { recursive: true });
      await fs.writeFile(path.join(repo, 'skills', name, 'SKILL.md'), repo === source ? `current ${name}\n` : `old ${name}\n`);
    }
    await fs.writeFile(path.join(repo, 'README.md'), 'Repository owner content\n');
    await fs.writeFile(path.join(repo, '.gitignore'), '*.local\n');
  }
  await fs.writeFile(path.join(source, 'skills/ti-api/runner.sh'), '#!/bin/sh\nprintf test\n', { mode: 0o755 });
  await fs.writeFile(path.join(source, 'skills/ti-guides/binary.bin'), Buffer.from([0, 255, 13, 10, 128]));
  await fs.writeFile(path.join(target, 'skills/ti-api/obsolete.md'), 'obsolete\n');
  await fs.mkdir(path.join(target, 'skills/ti-expert'));
  await fs.writeFile(path.join(target, 'skills/ti-expert/SKILL.md'), 'Hans native skill\n');
  for (const repo of [source, target]) {
    await git(repo, 'add', '.');
    await git(repo, 'commit', '-m', 'fixture baseline');
  }
  await git(target, 'remote', 'add', 'origin', 'https://github.com/macCesar/skills.git');
  await git(target, 'remote', 'add', 'upstream', 'git@github.com:tidev/skills.git');
  await git(target, 'update-ref', 'refs/remotes/upstream/main', 'HEAD');
  await git(target, 'switch', '-c', 'docs/sync-reference-skills');
  await fs.writeFile(path.join(target, 'skills/ti-api/keep.local'), 'ignored owner file\n');
  const bodyFile = path.join(directory, 'reviewed body.md');
  await fs.writeFile(bodyFile, 'Update the five reference skills from the reviewed TiTools commit.\n');
  return { directory, source, target, bodyFile };
}

async function cli(f, ...args) {
  return run(process.execPath, [script, '--source', f.source, '--target', f.target, ...args]);
}

async function loadSync() {
  return (await import('../scripts/sync-tidev-skills.mjs')).syncSkills;
}

function publisher({ prs = [], authError, pushError, remoteHead = '' } = {}) {
  const calls = [];
  const execute = async (command, args, options) => {
    calls.push({ command, args, host: options.env.GH_HOST });
    if (command === 'gh') {
      if (args[0] === 'auth' && authError) throw new Error(authError);
      return { stdout: args[1] === 'list' ? JSON.stringify(prs) : 'https://github.com/tidev/skills/pull/42\n' };
    }
    if (args[0] === 'push' && pushError) throw new Error(pushError);
    if (args[0] === 'ls-remote') return { stdout: remoteHead };
    if (['fetch', 'push'].includes(args[0])) return { stdout: '' };
    return run(command, args, options);
  };
  return { calls, execute };
}

describe('TiDev skill synchronization', () => {
  it('default check reports changes without writing either repository', async t => {
    const f = await fixture(t);
    const before = await git(f.target, 'status', '--porcelain');
    const result = await cli(f);
    const report = JSON.parse(result.stdout);
    assert.equal(report.mode, 'check');
    assert.ok(report.changes.updated.includes('skills/ti-api/SKILL.md'));
    assert.ok(report.changes.removed.includes('skills/ti-api/obsolete.md'));
    assert.equal(await git(f.target, 'status', '--porcelain'), before);
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-api/SKILL.md'), 'utf8'), 'old ti-api\n');
    assert.equal(await git(f.source, 'status', '--porcelain'), '');
  });

  it('applies exact bytes and executable mode, prunes tracked obsolete files, and preserves owner content', async t => {
    const f = await fixture(t);
    await fs.writeFile(path.join(f.source, 'maintenance-note.txt'), 'unrelated source work\n');
    await cli(f, '--apply');
    assert.deepEqual(await fs.readFile(path.join(f.target, 'skills/ti-guides/binary.bin')), Buffer.from([0, 255, 13, 10, 128]));
    assert.equal((await fs.stat(path.join(f.target, 'skills/ti-api/runner.sh'))).mode & 0o777, 0o755);
    await assert.rejects(fs.stat(path.join(f.target, 'skills/ti-api/obsolete.md')), { code: 'ENOENT' });
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-api/keep.local'), 'utf8'), 'ignored owner file\n');
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-expert/SKILL.md'), 'utf8'), 'Hans native skill\n');
    assert.equal(await fs.readFile(path.join(f.target, 'README.md'), 'utf8'), 'Repository owner content\n');
    assert.equal(await git(f.target, 'diff', '--cached', '--name-only'), '');
  });

  it('uses committed blob bytes from the selected ref rather than filtered working-tree bytes', async t => {
    const f = await fixture(t);
    await fs.writeFile(path.join(f.source, '.gitattributes'), 'skills/ti-guides/lines.txt text eol=crlf\n');
    await fs.writeFile(path.join(f.source, 'skills/ti-guides/lines.txt'), 'one\r\ntwo\r\n');
    await git(f.source, 'add', '.');
    await git(f.source, 'commit', '-m', 'fixture text filter');
    const ref = await git(f.source, 'rev-parse', 'HEAD');
    await fs.writeFile(path.join(f.source, 'README.md'), 'newer maintenance commit\n');
    await git(f.source, 'add', 'README.md');
    await git(f.source, 'commit', '-m', 'fixture later maintenance');
    const result = await cli(f, '--source-ref', ref, '--apply');
    assert.equal(JSON.parse(result.stdout).sourceRef, ref);
    assert.equal(await fs.readFile(path.join(f.source, 'skills/ti-guides/lines.txt'), 'utf8'), 'one\r\ntwo\r\n');
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-guides/lines.txt'), 'utf8'), 'one\ntwo\n');
  });

  it('rejects a dirty source payload and a dirty target before any copy', async t => {
    const f = await fixture(t);
    await fs.writeFile(path.join(f.source, 'skills/ti-api/SKILL.md'), 'uncommitted\n');
    await assert.rejects(cli(f, '--apply'), /source.*(dirty|differ|changes)/i);
    await git(f.source, 'restore', 'skills/ti-api/SKILL.md');
    await fs.writeFile(path.join(f.source, 'skills/ti-guides/untracked.md'), 'not reviewed\n');
    await assert.rejects(cli(f, '--apply'), /source.*(dirty|differ|changes)/i);
    await fs.unlink(path.join(f.source, 'skills/ti-guides/untracked.md'));
    await fs.writeFile(path.join(f.target, 'README.md'), 'owner editing\n');
    await assert.rejects(cli(f, '--apply'), /target.*(clean|dirty)/i);
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-api/SKILL.md'), 'utf8'), 'old ti-api\n');
  });

  it('rejects ignored collisions before pruning or copying', async t => {
    const f = await fixture(t);
    await fs.writeFile(path.join(f.source, 'skills/ti-api/keep.local'), 'incoming\n');
    await git(f.source, 'add', '-f', 'skills/ti-api/keep.local');
    await git(f.source, 'commit', '-m', 'fixture ignored collision');
    await assert.rejects(cli(f, '--apply'), /(ignored|untracked).*collision|collision.*(ignored|untracked)/i);
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-api/keep.local'), 'utf8'), 'ignored owner file\n');
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-api/obsolete.md'), 'utf8'), 'obsolete\n');
  });

  it('rejects tracked source symlinks and target directory symlinks', async t => {
    const f = await fixture(t);
    const outside = path.join(f.directory, 'outside');
    await fs.mkdir(outside);
    await fs.writeFile(path.join(outside, 'SKILL.md'), 'outside content\n');
    await fs.unlink(path.join(f.source, 'skills/ti-api/SKILL.md'));
    await fs.symlink(path.join(outside, 'SKILL.md'), path.join(f.source, 'skills/ti-api/SKILL.md'));
    await git(f.source, 'add', '.');
    await git(f.source, 'commit', '-m', 'fixture source symlink');
    await assert.rejects(cli(f, '--apply'), /symlink|symbolic/i);
    await git(f.source, 'reset', '--hard', 'HEAD^');
    await fs.rm(path.join(f.target, 'skills/ti-guides'), { recursive: true });
    await fs.symlink(outside, path.join(f.target, 'skills/ti-guides'));
    await git(f.target, 'add', '-A');
    await git(f.target, 'commit', '-m', 'fixture target symlink');
    await assert.rejects(cli(f, '--apply'), /symlink|symbolic/i);
    assert.equal(await fs.readFile(path.join(outside, 'SKILL.md'), 'utf8'), 'outside content\n');
  });

  it('requires a separate target, a contribution branch, and an official repository or fork', async t => {
    const f = await fixture(t);
    await assert.rejects(run(process.execPath, [script, '--source', f.source, '--target', f.source, '--apply']), /same|separate/i);
    await git(f.target, 'switch', 'main');
    await assert.rejects(cli(f, '--apply'), /contribution|main|master/i);
    await git(f.target, 'switch', 'docs/sync-reference-skills');
    await git(f.target, 'remote', 'set-url', 'upstream', 'https://github.com/example/other.git');
    await assert.rejects(cli(f, '--apply'), /tidev\/skills|upstream/i);
  });

  it('requires title and a nonempty reviewed body before publish can mutate anything', async t => {
    const f = await fixture(t);
    const sync = await loadSync();
    const emptyBody = path.join(f.directory, 'empty.md');
    await fs.writeFile(emptyBody, ' \n');
    for (const details of [{}, { title: 'docs: update' }, { title: 'docs: update', bodyFile: path.join(f.directory, 'missing.md') }, { title: 'docs: update', bodyFile: emptyBody }]) {
      const remote = publisher();
      await assert.rejects(sync({ source: f.source, target: f.target, ...details, mode: 'publish' }, remote.execute), /title|body/i);
      assert.equal(remote.calls.length, 0);
    }
    assert.equal(await git(f.target, 'status', '--porcelain'), '');
  });

  it('protects an ignored directory that obstructs an incoming file', async t => {
    const f = await fixture(t);
    const collision = path.join(f.target, 'skills/ti-guides/binary.bin');
    await fs.mkdir(collision);
    await fs.writeFile(path.join(collision, 'owner.local'), 'owner data\n');
    await assert.rejects(cli(f, '--apply'), /directory collision/i);
    assert.equal(await fs.readFile(path.join(collision, 'owner.local'), 'utf8'), 'owner data\n');
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-api/obsolete.md'), 'utf8'), 'obsolete\n');
  });

  it('rejects a fork whose push URL points at upstream before applying', async t => {
    const f = await fixture(t);
    await git(f.target, 'remote', 'set-url', '--push', 'origin', 'https://github.com/tidev/skills.git');
    const remote = publisher();
    await assert.rejects((await loadSync())({ ...f, mode: 'publish', title: 'docs: sync' }, remote.execute), /origin fork|push remote/i);
    assert.ok(!remote.calls.some(call => call.command === 'gh' || call.args[0] === 'push'));
    assert.equal(await git(f.target, 'status', '--porcelain'), '');
  });

  it('rejects an origin branch that advanced before writing files', async t => {
    const f = await fixture(t);
    const original = await git(f.target, 'rev-parse', 'HEAD');
    await git(f.target, 'commit', '--allow-empty', '-m', 'fixture remote advanced');
    const advanced = await git(f.target, 'rev-parse', 'HEAD');
    await git(f.target, 'reset', '--hard', original);
    const remote = publisher({ remoteHead: `${advanced}\trefs/heads/docs/sync-reference-skills\n` });
    await assert.rejects((await loadSync())({ ...f, mode: 'publish', title: 'docs: sync' }, remote.execute), /origin branch.*advanced/i);
    assert.equal(await git(f.target, 'status', '--porcelain'), '');
    assert.ok(!remote.calls.some(call => call.args[0] === 'push'));
  });

  it('commits only the five roots, pushes the fork, and creates the proposed PR with safe arguments', async t => {
    const f = await fixture(t);
    const sync = await loadSync();
    const remote = publisher();
    const title = 'docs: sync "14" $(not-a-command)';
    const report = await sync({ ...f, mode: 'publish', title }, remote.execute);
    assert.equal(report.published, true);
    assert.equal(await git(f.target, 'status', '--porcelain'), '');
    const added = remote.calls.find(call => call.command === 'git' && call.args[0] === 'add');
    assert.deepEqual(added.args, ['add', '--', ...names.map(name => `skills/${name}`)]);
    const push = remote.calls.find(call => call.command === 'git' && call.args[0] === 'push');
    assert.equal(push.args[2], 'origin');
    assert.ok(push.args.includes('HEAD:refs/heads/docs/sync-reference-skills'));
    assert.ok(!push.args.some(arg => arg.includes('force')));
    const create = remote.calls.find(call => call.command === 'gh' && call.args[1] === 'create');
    assert.ok(create.args.includes('macCesar:docs/sync-reference-skills'));
    assert.ok(create.args.includes(title));
    assert.ok(create.args.includes(f.bodyFile));
    assert.equal(create.host, 'github.com');
    assert.equal(await git(f.target, 'show', '--format=', '--name-only', 'HEAD').then(value => value.split('\n').every(file => names.some(name => file.startsWith(`skills/${name}/`)))), true);
  });

  it('updates the fork owner existing PR when the mirror has no changes but the branch has commits', async t => {
    const f = await fixture(t);
    await cli(f, '--apply');
    await git(f.target, 'add', '.');
    await git(f.target, 'commit', '-m', 'docs(skills): existing mirror');
    const head = await git(f.target, 'rev-parse', 'HEAD');
    const remote = publisher({ prs: [
      { number: 7, headRepositoryOwner: { login: 'someoneElse' } },
      { number: 42, url: 'https://github.com/tidev/skills/pull/42', headRepositoryOwner: { login: 'macCesar' } },
    ] });
    const report = await (await loadSync())({ ...f, mode: 'publish', title: 'docs: update existing PR' }, remote.execute);
    assert.deepEqual(report.changes, { added: [], updated: [], removed: [] });
    assert.equal(await git(f.target, 'rev-parse', 'HEAD'), head);
    assert.ok(!remote.calls.some(call => call.command === 'gh' && call.args[1] === 'create'));
    const list = remote.calls.find(call => call.command === 'gh' && call.args[1] === 'list');
    assert.equal(list.args[list.args.indexOf('--head') + 1], 'docs/sync-reference-skills');
    const edit = remote.calls.find(call => call.command === 'gh' && call.args[1] === 'edit');
    assert.equal(edit.args[2], '42');
  });

  it('skips push and PR when both mirror and upstream comparison are empty', async t => {
    const f = await fixture(t);
    await cli(f, '--apply');
    await git(f.target, 'add', '.');
    await git(f.target, 'commit', '-m', 'fixture matching upstream');
    await git(f.target, 'update-ref', 'refs/remotes/upstream/main', 'HEAD');
    const remote = publisher();
    const report = await (await loadSync())({ ...f, mode: 'publish', title: 'docs: nothing to send' }, remote.execute);
    assert.equal(report.published, false);
    assert.ok(!remote.calls.some(call => call.command === 'gh' && call.args[0] === 'pr'));
    assert.ok(!remote.calls.some(call => call.command === 'git' && call.args[0] === 'push'));
  });

  it('stops on authentication failure before copying', async t => {
    const f = await fixture(t);
    const remote = publisher({ authError: 'GitHub authentication failed' });
    await assert.rejects((await loadSync())({ ...f, mode: 'publish', title: 'docs: sync' }, remote.execute), /authentication failed/);
    assert.equal(await fs.readFile(path.join(f.target, 'skills/ti-api/SKILL.md'), 'utf8'), 'old ti-api\n');
    assert.equal(await git(f.target, 'status', '--porcelain'), '');
  });

  it('stops on upstream divergence and never creates a PR after a failed push', async t => {
    const f = await fixture(t);
    const original = await git(f.target, 'rev-parse', 'HEAD');
    await git(f.target, 'commit', '--allow-empty', '-m', 'fixture upstream moved');
    await git(f.target, 'update-ref', 'refs/remotes/upstream/main', 'HEAD');
    await git(f.target, 'reset', '--hard', original);
    const remote = publisher();
    const sync = await loadSync();
    await assert.rejects(sync({ ...f, mode: 'publish', title: 'docs: sync' }, remote.execute), /upstream|diverg/i);
    assert.equal(await git(f.target, 'status', '--porcelain'), '');
    await git(f.target, 'update-ref', 'refs/remotes/upstream/main', 'HEAD');
    const failed = publisher({ pushError: 'Push denied' });
    await assert.rejects(sync({ ...f, mode: 'publish', title: 'docs: sync' }, failed.execute), /Push denied/);
    assert.ok(!failed.calls.some(call => call.command === 'gh' && call.args[0] === 'pr'));
  });
});
