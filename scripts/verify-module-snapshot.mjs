#!/usr/bin/env node
/** Read-only check of an official module skill snapshot against its source repo. */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');

function markdownFiles(dir, base, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) markdownFiles(full, base, found);
    else if (entry.name.endsWith('.md')) found.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return found;
}

export async function verifySnapshot(source, skill) {
  const snapshot = JSON.parse(readFileSync(path.join(skill, 'references/source-snapshot.json'), 'utf8'));
  const changed = [];
  const missing = [];
  const modifiedMirror = [];
  for (const record of snapshot.files) {
    const original = path.join(source, record.source);
    const mirrored = path.join(skill, record.destination);
    if (!existsSync(original)) missing.push(record.source);
    else if (digest(original) !== record.source_sha256) changed.push(record.source);
    if (!existsSync(mirrored) || digest(mirrored) !== record.mirrored_sha256) modifiedMirror.push(record.destination);
  }
  const known = new Set(snapshot.files.map(record => record.source));
  const newDocuments = markdownFiles(path.join(source, 'documentation'), source).filter(file => !known.has(file));
  let currentCommit = null;
  let dirtySource = null;
  try {
    const options = { cwd: source };
    currentCommit = (await run('git', ['rev-parse', 'HEAD'], options)).stdout.trim();
    dirtySource = (await run('git', ['status', '--porcelain'], options)).stdout.trim().length > 0;
  } catch {
    // An installed package may contain the docs without a Git repository.
  }
  const commitReviewRequired = currentCommit !== null && currentCommit !== snapshot.commit;
  return {
    module: snapshot.module,
    pinnedCommit: snapshot.commit,
    currentCommit,
    dirtySource,
    commitReviewRequired,
    changed,
    missing,
    newDocuments,
    modifiedMirror,
    valid: !changed.length && !missing.length && !newDocuments.length && !modifiedMirror.length && !commitReviewRequired && dirtySource !== true,
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/verify-module-snapshot.mjs --source /path/to/module-repo [--skill ti-admob-unified]');
    return;
  }
  let source;
  let name = 'ti-admob-unified';
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--source' && args[i + 1]) source = path.resolve(args[++i]);
    else if (args[i] === '--skill' && args[i + 1]) name = args[++i];
    else throw new Error('Unknown or incomplete argument: ' + args[i]);
  }
  if (!source) throw new Error('--source is required; this tool does not fetch, pull or write files');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) throw new Error('Invalid skill name');
  const report = await verifySnapshot(source, path.join(root, 'skills', name));
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.valid ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
