import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hook = join(root, 'hooks', 'session-start.sh');
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function runHook(tiapp) {
  const directory = await mkdtemp(join(tmpdir(), 'titools-session-hook-'));
  temporaryDirectories.push(directory);
  await writeFile(join(directory, 'tiapp.xml'), tiapp, 'utf8');
  return run('bash', [hook], { cwd: directory });
}

describe('SessionStart module detection', () => {
  it('points ti.synthengine projects at ti-synthengine', async () => {
    const { stdout } = await runHook(`<?xml version="1.0"?>
<ti:app xmlns:ti="http://ti.appcelerator.org">
  <modules>
    <module platform="android">ti.synthengine</module>
    <module platform="iphone">ti.synthengine</module>
  </modules>
</ti:app>`);

    const payload = JSON.parse(stdout);
    assert.match(payload.message, /\+ ti\.synthengine/);
    assert.match(payload.message, /invoke ti-synthengine/);
    assert.match(payload.message, /option objects are strict/);
  });

  it('does not add the synth hint to an unrelated Titanium project', async () => {
    const { stdout } = await runHook(`<?xml version="1.0"?>
<ti:app xmlns:ti="http://ti.appcelerator.org"><modules /></ti:app>`);

    const payload = JSON.parse(stdout);
    assert.doesNotMatch(payload.message, /ti\.synthengine/);
    assert.doesNotMatch(payload.message, /ti-synthengine/);
  });
});
