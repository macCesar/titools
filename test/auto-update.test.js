import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const binPath = join(process.cwd(), 'bin', 'titools.js');

function runCli(args, { cwd, env }) {
  return new Promise((resolve) => {
    execFile(process.execPath, [binPath, ...args], { cwd, env, timeout: 15000 }, (error, stdout, stderr) => {
      resolve({
        code: error?.code ?? 0,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
      });
    });
  });
}

describe('auto-update command', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'titools-autoupdate-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('auto-update --silent exits cleanly when already checked today', async () => {
    const cacheDir = join(tempDir, '.titools');
    await mkdir(cacheDir, { recursive: true });
    await writeFile(
      join(cacheDir, 'last-check.json'),
      JSON.stringify({ lastCheck: Date.now(), latestVersion: '99.0.0' }),
      'utf8'
    );

    const result = await runCli(['auto-update', '--silent'], {
      cwd: tempDir,
      env: {
        ...process.env,
        HOME: tempDir,
        TITOOLS_CACHE_TTL_MS: String(24 * 60 * 60 * 1000),
      },
    });

    assert.strictEqual(result.stdout.trim(), '');
  });

  it('auto-update --silent skips npm update in dev mode', async () => {
    const cacheDir = join(tempDir, '.titools');
    await mkdir(cacheDir, { recursive: true });

    const result = await runCli(['auto-update', '--silent'], {
      cwd: tempDir,
      env: {
        ...process.env,
        HOME: tempDir,
        TITOOLS_TEST_NPM_LATEST_VERSION: '99.99.99',
        TITOOLS_CACHE_TTL_MS: '0',
      },
    });

    assert.ok(existsSync(join(cacheDir, 'last-check.json')));
  });

  it('auto-update without --silent shows progress', async () => {
    const result = await runCli(['auto-update'], {
      cwd: tempDir,
      env: {
        ...process.env,
        HOME: tempDir,
        TITOOLS_CACHE_TTL_MS: '0',
      },
    });

    assert.ok(result.stdout.length > 0 || result.stderr.length > 0);
  });
});
