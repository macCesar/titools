/**
 * Claude Code hook management
 * Installs/removes the SessionStart hook for auto-update
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const HOOK_COMMAND = 'titools auto-update --silent';
const SETTINGS_FILE = 'settings.json';

function readSettings(claudeDir) {
  const settingsPath = join(claudeDir, SETTINGS_FILE);
  if (!existsSync(settingsPath)) return {};
  try {
    return JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch {
    return {};
  }
}

function writeSettings(claudeDir, settings) {
  writeFileSync(
    join(claudeDir, SETTINGS_FILE),
    JSON.stringify(settings, null, 2) + '\n',
    'utf8'
  );
}

/**
 * Find the hook entry that contains our command
 * Claude Code hook format: { hooks: [{ type: "command", command: "..." }] }
 */
function findHookEntry(sessionStartHooks) {
  if (!Array.isArray(sessionStartHooks)) return -1;
  return sessionStartHooks.findIndex((entry) =>
    Array.isArray(entry.hooks) &&
    entry.hooks.some((h) => h.type === 'command' && h.command === HOOK_COMMAND)
  );
}

export function hasHook(claudeDir) {
  const settings = readSettings(claudeDir);
  const hooks = settings.hooks?.SessionStart;
  return findHookEntry(hooks) !== -1;
}

export function installHook(claudeDir) {
  if (hasHook(claudeDir)) return;
  const settings = readSettings(claudeDir);
  if (!settings.hooks) settings.hooks = {};
  if (!Array.isArray(settings.hooks.SessionStart)) settings.hooks.SessionStart = [];
  settings.hooks.SessionStart.push({
    hooks: [
      {
        type: 'command',
        command: HOOK_COMMAND,
      },
    ],
  });
  writeSettings(claudeDir, settings);
}

export function removeHook(claudeDir) {
  if (!hasHook(claudeDir)) return;
  const settings = readSettings(claudeDir);
  const idx = findHookEntry(settings.hooks.SessionStart);
  if (idx !== -1) {
    settings.hooks.SessionStart.splice(idx, 1);
  }
  writeSettings(claudeDir, settings);
}

export default { installHook, removeHook, hasHook };
