import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const binPath = join(repoRoot, 'bin', 'titools.js');

function run(args) {
  return new Promise((resolvePromise) => {
    execFile(process.execPath, [binPath, ...args], { timeout: 15000 }, (error, stdout, stderr) => {
      resolvePromise({
        code: error?.code ?? 0,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
      });
    });
  });
}

describe('list command', () => {
  it('prints a skills header', async () => {
    const result = await run(['list']);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /Titanium skills/i);
  });

  it('lists every skill from the SKILLS array', async () => {
    const result = await run(['list']);
    assert.equal(result.code, 0);
    for (const skill of ['alloy-guides', 'alloy-howtos', 'purgetss', 'ti-api',
                         'ti-expert', 'ti-guides', 'ti-howtos', 'ti-ui']) {
      assert.match(result.stdout, new RegExp(skill), `expected skill "${skill}" in list output`);
    }
  });

  it('aliases to "ls"', async () => {
    const result = await run(['ls']);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /Titanium skills/i);
  });

  it('shows installation count footer', async () => {
    const result = await run(['list']);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /\d+\/\d+ installed/);
  });
});
