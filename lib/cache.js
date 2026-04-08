/**
 * Cache for update checks
 * Stores last check timestamp to avoid hitting npm registry on every run
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CACHE_FILE = 'last-check.json';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getTtl() {
  const envTtl = process.env.TITOOLS_CACHE_TTL_MS;
  return envTtl ? parseInt(envTtl, 10) : DEFAULT_TTL_MS;
}

export function readLastCheck(cacheDir) {
  const filePath = join(cacheDir, CACHE_FILE);
  if (!existsSync(filePath)) return null;

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    if (typeof data.lastCheck !== 'number' || typeof data.latestVersion !== 'string') {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function writeLastCheck(cacheDir, latestVersion) {
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }
  writeFileSync(
    join(cacheDir, CACHE_FILE),
    JSON.stringify({ lastCheck: Date.now(), latestVersion }),
    'utf8'
  );
}

export function shouldCheckForUpdate(cacheDir) {
  const data = readLastCheck(cacheDir);
  if (!data) return true;
  return (Date.now() - data.lastCheck) >= getTtl();
}

export default { readLastCheck, writeLastCheck, shouldCheckForUpdate };
