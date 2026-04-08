import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { shouldCheckForUpdate, writeLastCheck, readLastCheck } from '../lib/cache.js';

describe('cache', () => {
  let cacheDir;

  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), 'titools-cache-test-'));
  });

  afterEach(async () => {
    await rm(cacheDir, { recursive: true, force: true });
  });

  it('shouldCheckForUpdate returns true when no cache file exists', () => {
    const result = shouldCheckForUpdate(cacheDir);
    assert.strictEqual(result, true);
  });

  it('shouldCheckForUpdate returns false when checked recently', () => {
    writeLastCheck(cacheDir, '2.3.0');
    const result = shouldCheckForUpdate(cacheDir);
    assert.strictEqual(result, false);
  });

  it('shouldCheckForUpdate returns true when cache is expired', async () => {
    const expired = Date.now() - (25 * 60 * 60 * 1000);
    await mkdir(cacheDir, { recursive: true });
    await writeFile(
      join(cacheDir, 'last-check.json'),
      JSON.stringify({ lastCheck: expired, latestVersion: '2.3.0' }),
      'utf8'
    );
    const result = shouldCheckForUpdate(cacheDir);
    assert.strictEqual(result, true);
  });

  it('shouldCheckForUpdate returns true when cache file is malformed', async () => {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(join(cacheDir, 'last-check.json'), 'not json', 'utf8');
    const result = shouldCheckForUpdate(cacheDir);
    assert.strictEqual(result, true);
  });

  it('writeLastCheck creates cache file with timestamp and version', () => {
    writeLastCheck(cacheDir, '2.4.0');
    const data = readLastCheck(cacheDir);
    assert.strictEqual(data.latestVersion, '2.4.0');
    assert.ok(typeof data.lastCheck === 'number');
    assert.ok(Date.now() - data.lastCheck < 5000);
  });

  it('readLastCheck returns null when no file exists', () => {
    const data = readLastCheck(cacheDir);
    assert.strictEqual(data, null);
  });
});
