import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const python = process.env.TITOOLS_ASSETS_PYTHON || 'python3';

test('game asset helpers expose help without mutations', async () => {
  for (const script of ['alpha_tools.py', 'validate_manifest.py']) {
    const { stdout } = await run(python, [path.join(root, 'skills/ti-game-assets/scripts', script), '--help'], {
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    assert.match(stdout, /usage:/);
  }
});

test('game art and sound inventory behavioral checks', async () => {
  const { stderr } = await run(python, [path.join(root, 'test/game_assets_test.py')], {
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  assert.match(stderr, /OK/);
});
