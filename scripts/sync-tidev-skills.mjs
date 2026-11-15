#!/usr/bin/env node
/** Maintainer-only mirror of the five TiDev reference skills from a reviewed Git ref. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const sourceRoot = fileURLToPath(new URL('..', import.meta.url));
const names = ['ti-api', 'ti-guides', 'ti-howtos', 'alloy-guides', 'alloy-howtos'];
const roots = names.map(name => `skills/${name}`);

const help = `Usage: node scripts/sync-tidev-skills.mjs --target PATH [options]

  --source PATH       TiTools checkout (default: this script's repository)
  --source-ref REF    Reviewed source commit/ref (default: HEAD)
  --check             Report changes without writing (default)
  --apply             Copy/prune only the five reference skill roots
  --publish           Apply, commit changes, push origin fork, create/update TiDev PR
  --title TEXT        Required for --publish
  --body-file PATH    Required nonempty PR body for --publish
  --help              Show this help

Apply/publish require a clean target on an existing contribution branch.
Publish requires an origin GitHub fork and a branch containing upstream/main.
The agent must review title/body with humanizer before invoking --publish;
this command does not run that skill. No clone, install, rebase or force push.
`;

function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (['--check', '--apply', '--publish', '--help'].includes(arg)) options[arg.slice(2)] = true;
    else if (['--target', '--source', '--source-ref', '--title', '--body-file'].includes(arg) && args[i + 1] && !args[i + 1].startsWith('--')) {
      const key = { '--source-ref': 'sourceRef', '--body-file': 'bodyFile' }[arg] || arg.slice(2);
      options[key] = args[++i];
    } else throw new Error(`Unknown or incomplete argument: ${arg}`);
  }
  if (options.check && (options.apply || options.publish)) throw new Error('--check cannot be combined with --apply or --publish');
  options.mode = options.publish ? 'publish' : options.apply ? 'apply' : 'check';
  return options;
}

async function stat(file) {
  try { return await fs.lstat(file); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function validateRelative(file) {
  if (file.includes('\\') || path.isAbsolute(file) || file.split('/').some(part => !part || part === '.' || part === '..')
    || !roots.some(root => file === root || file.startsWith(root + '/'))) {
    throw new Error(`Unsafe skill path: ${file}`);
  }
}

/** Check every existing component without following a payload symlink. */
async function inspectPath(root, relative) {
  const parts = relative.split('/');
  let current = root;
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    const info = await stat(current);
    if (!info) return null;
    if (info.isSymbolicLink()) throw new Error(`Symbolic link in skill path: ${current}`);
    if (i < parts.length - 1 && !info.isDirectory()) throw new Error(`Directory collision: ${current}`);
    if (i === parts.length - 1) return info;
  }
}

function githubRemote(url) {
  const match = /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([a-z\d-]+)\/skills(?:\.git)?\/?$/i.exec(url);
  return match ? { owner: match[1] } : null;
}

function entries(output, source) {
  const result = new Map();
  for (const line of output.toString().split('\0').filter(Boolean)) {
    const tab = line.indexOf('\t');
    const [mode, kind, stage] = line.slice(0, tab).split(' ');
    const file = line.slice(tab + 1);
    validateRelative(file);
    if (mode === '120000') throw new Error(`Tracked symbolic link is not allowed: ${file}`);
    if (!['100644', '100755'].includes(mode) || (source ? kind !== 'blob' : stage !== '0')) {
      throw new Error(`Unsupported Git entry: ${file}`);
    }
    result.set(file, { file, mode, oid: source ? stage : kind });
  }
  return result;
}

/** The injectable execFile-compatible runner lets tests isolate all network publication calls. */
export async function syncSkills(options, execute = run) {
  const mode = options.mode || 'check';
  if (!['check', 'apply', 'publish'].includes(mode)) throw new Error('Invalid synchronization mode');
  if (!options.target) throw new Error('--target is required');
  let bodyFile;
  if (mode === 'publish') {
    if (!options.title?.trim()) throw new Error('--publish requires a nonempty --title reviewed by the agent');
    if (!options.bodyFile) throw new Error('--publish requires --body-file reviewed with humanizer by the agent');
    bodyFile = path.resolve(options.bodyFile);
    const body = await stat(bodyFile);
    if (!body?.isFile() || !(await fs.readFile(bodyFile, 'utf8')).trim()) throw new Error('PR body file must be a nonempty regular file');
  }
  const source = await fs.realpath(options.source || sourceRoot);
  const target = await fs.realpath(options.target);
  if (source === target) throw new Error('Source and target must be separate repositories, not the same checkout');
  const command = (cwd, binary, args) => execute(binary, args, {
    cwd, encoding: 'buffer', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', ...(binary === 'gh' ? { GH_HOST: 'github.com' } : {}) },
  });
  const git = (cwd, args) => command(cwd, 'git', args).then(result => result.stdout);
  const text = (cwd, args) => git(cwd, args).then(output => output.toString().trim());
  const succeeds = async args => {
    try { await git(target, args); return true; } catch (error) {
      if (error.code === 1) return false;
      throw error;
    }
  };
  for (const repo of [source, target]) {
    const top = await fs.realpath(await text(repo, ['rev-parse', '--show-toplevel']));
    if (top !== repo) throw new Error(`Expected a Git repository root: ${repo}`);
  }
  const sourceRef = await text(source, ['rev-parse', '--verify', '--end-of-options', `${options.sourceRef || 'HEAD'}^{commit}`]);
  if ((await git(source, ['diff', '--no-ext-diff', '--no-textconv', '--name-only', '-z', sourceRef, '--', ...roots])).length
    || (await git(source, ['ls-files', '--others', '--exclude-standard', '-z', '--', ...roots])).length) {
    throw new Error('Source skill payload has changes or differs from the selected ref');
  }
  const remoteNames = (await text(target, ['remote'])).split('\n').filter(Boolean);
  const remotes = new Map();
  for (const name of remoteNames) {
    const urls = (await text(target, ['remote', 'get-url', '--all', name])).split('\n');
    remotes.set(name, urls.length === 1 ? githubRemote(urls[0]) : null);
  }
  const origin = remotes.get('origin');
  const upstream = [...remotes].find(([, remote]) => remote?.owner.toLowerCase() === 'tidev')?.[0];
  if (!origin || !upstream) throw new Error('Target must be tidev/skills or a GitHub skills fork with an upstream pointing to tidev/skills');
  let branch = null;
  try { branch = await text(target, ['symbolic-ref', '--quiet', '--short', 'HEAD']); } catch (error) {
    if (error.code !== 1) throw error;
  }
  if (mode !== 'check') {
    if (!branch || ['main', 'master'].includes(branch.toLowerCase())) throw new Error('Use an existing contribution branch, not main/master or detached HEAD');
    if ((await git(target, ['status', '--porcelain=v1', '-z', '--untracked-files=all'])).length) throw new Error('Target must be clean before apply/publish');
  }
  if (mode === 'publish') {
    const pushURLs = (await text(target, ['remote', 'get-url', '--push', '--all', 'origin'])).split('\n');
    const pushOwner = pushURLs.length === 1 && githubRemote(pushURLs[0])?.owner;
    if (origin.owner.toLowerCase() === 'tidev' || pushOwner?.toLowerCase() !== origin.owner.toLowerCase()) throw new Error('Publish must push origin fork, never tidev/skills or a different push remote');
    const bodyRelative = path.relative(target, bodyFile).split(path.sep).join('/');
    if (roots.some(root => bodyRelative === root || bodyRelative.startsWith(root + '/'))) throw new Error('PR body file must be outside the mirrored skill roots');
  }
  const sourceEntries = entries(await git(source, ['ls-tree', '-r', '-z', sourceRef, '--', ...roots]), true);
  const targetEntries = entries(await git(target, ['ls-files', '--stage', '-z', '--', ...roots]), false);
  for (const root of roots) {
    if (!sourceEntries.has(root + '/SKILL.md')) throw new Error(`Source ref is missing ${root}/SKILL.md`);
    await inspectPath(source, root);
    await inspectPath(target, root);
  }
  const changes = { added: [], updated: [], removed: [] };
  for (const entry of sourceEntries.values()) {
    await inspectPath(source, entry.file);
    const info = await inspectPath(target, entry.file);
    if (info && !info.isFile()) throw new Error(`Directory collision at mirrored file: ${entry.file}`);
    if (!targetEntries.has(entry.file)) {
      if (info || await succeeds(['check-ignore', '--quiet', '--', entry.file])) throw new Error(`Ignored or untracked collision: ${entry.file}`);
      changes.added.push(entry.file);
    }
    entry.bytes = await git(source, ['cat-file', 'blob', entry.oid]);
    if (targetEntries.has(entry.file) && (!info || !entry.bytes.equals(await fs.readFile(path.join(target, entry.file)))
      || Boolean(info.mode & 0o111) !== (entry.mode === '100755') || targetEntries.get(entry.file).mode !== entry.mode)) changes.updated.push(entry.file);
  }
  for (const entry of targetEntries.values()) {
    const info = await inspectPath(target, entry.file);
    if (info && !info.isFile()) throw new Error(`Directory collision at tracked file: ${entry.file}`);
    if (!sourceEntries.has(entry.file)) changes.removed.push(entry.file);
  }
  const report = { mode, source, sourceRef, target, branch, changes, published: false };
  const changedFiles = [...changes.added, ...changes.updated];
  const hasChanges = changedFiles.length + changes.removed.length > 0;
  if (mode === 'check') return report;
  const base = `refs/remotes/${upstream}/main`;
  if (mode === 'publish') {
    await command(target, 'gh', ['auth', 'status', '--hostname', 'github.com']);
    await git(target, ['fetch', upstream, `refs/heads/main:${base}`]);
    if (!await succeeds(['merge-base', '--is-ancestor', base, 'HEAD'])) throw new Error('Contribution branch must contain current upstream/main; resolve upstream divergence manually');
    let remoteHead;
    try { remoteHead = await text(target, ['ls-remote', '--exit-code', '--heads', 'origin', `refs/heads/${branch}`]); } catch (error) {
      if (error.code !== 2) throw error;
    }
    if (remoteHead) {
      await git(target, ['fetch', 'origin', `refs/heads/${branch}`]);
      if (!await succeeds(['merge-base', '--is-ancestor', remoteHead.split(/\s/)[0], 'HEAD'])) throw new Error('Origin branch has diverged or advanced; reconcile it manually before publishing');
    }
    if (!hasChanges && await text(target, ['rev-list', '--count', `${base}..HEAD`]) === '0') return report;
  }
  // All payload paths and collisions have been checked before the first file mutation.
  for (const file of changes.removed) await fs.unlink(path.join(target, file));
  for (const file of changedFiles) {
    const entry = sourceEntries.get(file);
    const destination = path.join(target, file);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, entry.bytes);
    await fs.chmod(destination, entry.mode === '100755' ? 0o755 : 0o644);
  }
  if (mode === 'apply') return report;
  if (hasChanges) {
    await git(target, ['add', '--', ...roots]);
    for (const mode of ['100644', '100755']) {
      const files = changedFiles.filter(file => sourceEntries.get(file).mode === mode);
      if (files.length) await git(target, ['update-index', mode === '100755' ? '--chmod=+x' : '--chmod=-x', '--', ...files]);
    }
    for (const file of changedFiles) {
      if (!sourceEntries.get(file).bytes.equals(await git(target, ['show', `:${file}`]))) throw new Error(`Target Git filters changed mirrored bytes: ${file}`);
    }
    if (!await succeeds(['diff', '--cached', '--quiet', '--', ...roots])) await git(target, ['commit', '-m', 'docs(skills): sync reviewed TiTools references']);
  }
  await git(target, ['push', '--set-upstream', 'origin', `HEAD:refs/heads/${branch}`]);
  const listed = await command(target, 'gh', ['pr', 'list', '--repo', 'tidev/skills', '--state', 'open', '--base', 'main', '--head', branch, '--json', 'number,url,headRepositoryOwner']);
  const prs = JSON.parse(listed.stdout.toString()).filter(pr => pr.headRepositoryOwner?.login.toLowerCase() === origin.owner.toLowerCase());
  if (prs.length > 1) throw new Error('Multiple open PRs match this fork branch; resolve the ambiguity manually');
  const args = ['--repo', 'tidev/skills', '--title', options.title, '--body-file', bodyFile];
  const result = prs.length
    ? await command(target, 'gh', ['pr', 'edit', String(prs[0].number), ...args])
    : await command(target, 'gh', ['pr', 'create', ...args, '--base', 'main', '--head', `${origin.owner}:${branch}`]);
  report.published = true;
  report.pullRequest = prs[0]?.url || result.stdout.toString().trim();
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  Promise.resolve().then(async () => {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) console.log(help);
    else console.log(JSON.stringify(await syncSkills(options), null, 2));
  }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
