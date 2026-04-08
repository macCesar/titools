import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { installHook, removeHook, hasHook } from '../lib/hooks.js';

const HOOK_CMD = 'titools auto-update --silent';

describe('hooks', () => {
  let claudeDir;
  let settingsPath;

  beforeEach(async () => {
    claudeDir = await mkdtemp(join(tmpdir(), 'titools-hooks-test-'));
    settingsPath = join(claudeDir, 'settings.json');
  });

  afterEach(async () => {
    await rm(claudeDir, { recursive: true, force: true });
  });

  it('installHook creates settings.json if it does not exist', () => {
    installHook(claudeDir);
    assert.ok(existsSync(settingsPath));
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    assert.ok(Array.isArray(settings.hooks.SessionStart));
    const entry = settings.hooks.SessionStart[0];
    assert.ok(Array.isArray(entry.hooks));
    assert.strictEqual(entry.hooks[0].type, 'command');
    assert.strictEqual(entry.hooks[0].command, HOOK_CMD);
  });

  it('installHook appends to existing hooks without overwriting', async () => {
    const existing = {
      hooks: {
        SessionStart: [{ hooks: [{ type: 'command', command: 'echo hello' }] }]
      }
    };
    await writeFile(settingsPath, JSON.stringify(existing, null, 2), 'utf8');
    installHook(claudeDir);
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    assert.strictEqual(settings.hooks.SessionStart.length, 2);
    assert.strictEqual(settings.hooks.SessionStart[0].hooks[0].command, 'echo hello');
    assert.strictEqual(settings.hooks.SessionStart[1].hooks[0].command, HOOK_CMD);
  });

  it('installHook does not duplicate if hook already exists', () => {
    installHook(claudeDir);
    installHook(claudeDir);
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    const matches = settings.hooks.SessionStart.filter((entry) =>
      entry.hooks?.some((h) => h.command === HOOK_CMD)
    );
    assert.strictEqual(matches.length, 1);
  });

  it('removeHook removes only the titools hook', async () => {
    const existing = {
      hooks: {
        SessionStart: [
          { hooks: [{ type: 'command', command: 'echo hello' }] },
          { hooks: [{ type: 'command', command: HOOK_CMD }] }
        ]
      }
    };
    await writeFile(settingsPath, JSON.stringify(existing, null, 2), 'utf8');
    removeHook(claudeDir);
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    assert.strictEqual(settings.hooks.SessionStart.length, 1);
    assert.strictEqual(settings.hooks.SessionStart[0].hooks[0].command, 'echo hello');
  });

  it('removeHook does nothing if no settings.json', () => {
    assert.doesNotThrow(() => removeHook(claudeDir));
  });

  it('hasHook returns true when hook is installed', () => {
    installHook(claudeDir);
    assert.strictEqual(hasHook(claudeDir), true);
  });

  it('hasHook returns false when no settings.json', () => {
    assert.strictEqual(hasHook(claudeDir), false);
  });
});
