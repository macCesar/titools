/**
 * Basic CLI integration tests (offline, temp dirs).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { lstatSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import config from '../lib/config.js';

const binPath = join(process.cwd(), 'bin', 'titools.js');

function runCli(args, { cwd, env }) {
  return new Promise((resolve) => {
    execFile(process.execPath, [binPath, ...args], { cwd, env }, (error, stdout, stderr) => {
      resolve({
        code: error?.code ?? 0,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
      });
    });
  });
}

async function makeTempDir(prefix) {
  return mkdtemp(join(tmpdir(), prefix));
}

async function makeProject(dir) {
  await writeFile(
    join(dir, 'tiapp.xml'),
    '<ti:app xmlns:ti="http://ti.appcelerator.org">\n<id>com.test</id>\n<sdk-version>13.1.1.GA</sdk-version>\n</ti:app>\n',
    'utf8'
  );
}

async function makePlatformDirs(dir) {
  await mkdir(join(dir, '.claude'), { recursive: true });
  await mkdir(join(dir, '.gemini'), { recursive: true });
  await mkdir(join(dir, '.codex'), { recursive: true });
}

async function makeLocalSkills(dir) {
  const skillsDir = join(dir, '.agents', 'skills');
  await mkdir(skillsDir, { recursive: true });
  for (const skill of config.SKILLS) {
    await mkdir(join(skillsDir, skill), { recursive: true });
  }
}

async function writeAiFile(dir, filename = 'CLAUDE.md', content = '') {
  await writeFile(join(dir, filename), content, 'utf8');
}

describe('titools CLI', () => {
  it('sync: errors outside a Titanium project', async () => {
    const cwd = await makeTempDir('titools-no-project-');
    const home = await makeTempDir('titools-home-');
    const result = await runCli(['sync'], {
      cwd,
      env: { ...process.env, HOME: home, USERPROFILE: home },
    });
    assert.ok(result.stdout.includes('Error: Not a Titanium project'));
    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  });

  it('sync: errors in project without skills', async () => {
    const cwd = await makeTempDir('titools-project-');
    const home = await makeTempDir('titools-home-');
    await makeProject(cwd);
    const result = await runCli(['sync'], {
      cwd,
      env: { ...process.env, HOME: home, USERPROFILE: home },
    });
    assert.ok(result.stdout.includes('Error: Skills not installed'));
    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  });

  it('install: local install links platforms (no prompt)', async () => {
    const cwd = await makeTempDir('titools-project-');
    const home = await makeTempDir('titools-home-');
    await makeProject(cwd);
    await makePlatformDirs(cwd);

    const result = await runCli(['install', '--local', '--all'], {
      cwd,
      env: { ...process.env, HOME: home, USERPROFILE: home },
    });

    assert.ok(result.stdout.includes('Mode: Local installation'));
    assert.ok(result.stdout.includes('skills sync complete!'));

    const skillsDir = join(cwd, '.agents', 'skills');
    assert.ok(existsSync(skillsDir));

    const claudeLink = join(cwd, '.claude', 'skills', 'ti-expert');
    const geminiLink = join(cwd, '.gemini', 'skills', 'ti-expert');
    assert.ok(lstatSync(claudeLink).isSymbolicLink());
    assert.ok(lstatSync(geminiLink).isSymbolicLink());

    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  });

  it('update: exits early when no skills installed', async () => {
    const cwd = await makeTempDir('titools-empty-');
    const home = await makeTempDir('titools-home-');
    const result = await runCli(['update'], {
      cwd,
      env: { ...process.env, HOME: home, USERPROFILE: home },
    });
    assert.ok(result.stdout.includes('No skills installed at this location.'));
    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  });

  it('update: shows npm update instructions when CLI is outdated and does not sync knowledge files', async () => {
    const cwd = await makeTempDir('titools-project-');
    const home = await makeTempDir('titools-home-');
    await makeProject(cwd);
    await makeLocalSkills(cwd);
    await writeAiFile(cwd, 'CLAUDE.md', 'original');

    const result = await runCli(['update', '--local'], {
      cwd,
      env: {
        ...process.env,
        HOME: home,
        USERPROFILE: home,
        TITOOLS_TEST_NPM_LATEST_VERSION: '99.0.0',
      },
    });
    const output = `${result.stdout}\n${result.stderr}`;

    assert.ok(output.includes('New version available'));
    assert.ok(output.includes(`Current: v${config.PACKAGE_VERSION}`));
    assert.ok(output.includes('Latest:  99.0.0'));
    assert.ok(output.includes('npm update -g @maccesar/titools'));
    assert.ok(output.includes('titools update'));

    const content = await import('node:fs/promises').then(({ readFile }) => readFile(join(cwd, 'CLAUDE.md'), 'utf8'));
    assert.strictEqual(content, 'original');

    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  });

  it('update: syncs skills and refreshes knowledge files when CLI is current', async () => {
    const cwd = await makeTempDir('titools-project-');
    const home = await makeTempDir('titools-home-');
    await makeProject(cwd);
    await makeLocalSkills(cwd);
    await writeAiFile(cwd, 'CLAUDE.md', 'original');

    const result = await runCli(['update', '--local'], {
      cwd,
      env: {
        ...process.env,
        HOME: home,
        USERPROFILE: home,
        TITOOLS_TEST_NPM_LATEST_VERSION: config.PACKAGE_VERSION,
      },
    });
    const output = `${result.stdout}\n${result.stderr}`;

    assert.ok(output.includes(`CLI is up to date (v${config.PACKAGE_VERSION})`));
    assert.ok(output.includes('skills updated'));
    assert.ok(output.includes('Update complete!'));

    const content = await import('node:fs/promises').then(({ readFile }) => readFile(join(cwd, 'CLAUDE.md'), 'utf8'));
    assert.ok(content.includes(config.BLOCK_START));

    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  });

  it('sync --force: updates instruction files when skills exist', async () => {
    const cwd = await makeTempDir('titools-project-');
    const home = await makeTempDir('titools-home-');
    await makeProject(cwd);
    await makeLocalSkills(cwd);

    const result = await runCli(['sync', '--force'], {
      cwd,
      env: { ...process.env, HOME: home, USERPROFILE: home },
    });

    assert.ok(result.stdout.includes('Titanium project'));
    const agentsFile = join(cwd, 'CLAUDE.md');
    assert.ok(existsSync(agentsFile));
    const content = await import('node:fs/promises').then(({ readFile }) => readFile(agentsFile, 'utf8'));
    assert.ok(content.includes(config.BLOCK_START));

    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  });
});
