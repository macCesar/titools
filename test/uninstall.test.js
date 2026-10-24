/** Shared removal scopes, exercised through the real CLI with only the prompt replaced. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { SKILLS, COMMANDS, LEGACY_COMMANDS } from '../lib/config.js';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const bin = join(root, Object.values(pkg.bin)[0]);

async function fixture(t, targets) {
  const base = await mkdtemp(join(tmpdir(), 'cli-remove-scopes-'));
  t.after(() => rm(base, { recursive: true, force: true }));
  const home = join(base, 'home');
  const cwd = join(base, 'project');
  const capture = join(base, 'prompt.json');
  for (const dir of [home, cwd]) {
    await mkdir(join(dir, '.claude', 'skills', SKILLS[0]), { recursive: true });
  }
  await writeFile(join(cwd, 'tiapp.xml'), '<ti:app xmlns:ti="http://ti.appcelerator.org"><id>test.scopes</id></ti:app>');
  const prompt = join(base, 'prompt.mjs');
  await writeFile(prompt, `import { writeFileSync } from 'node:fs';
export class Separator { constructor(name) { this.name = name; } }
export default async function prompt(options) {
  writeFileSync(${JSON.stringify(capture)}, JSON.stringify(options));
  return ${JSON.stringify(targets)};
}`);
  const loader = join(base, 'loader.mjs');
  await writeFile(loader, `import { pathToFileURL } from 'node:url';
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('/prompts/checkboxCancel.js')) {
    return { url: pathToFileURL(${JSON.stringify(prompt)}).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}`);
  return {
    home, cwd,
    async remove() {
      return run(process.execPath, ['--experimental-loader', loader, bin, 'remove', '--local'], {
        cwd, timeout: 15000,
        env: { ...process.env, HOME: home, USERPROFILE: home },
      });
    },
    async choices() { return JSON.parse(await readFile(capture, 'utf8')).choices; },
  };
}

test('remove --local: home mirror selection removes home links and preserves project links', async t => {
  const f = await fixture(t, ['symlinks-home']);
  await f.remove();
  assert.equal(existsSync(join(f.home, '.claude', 'skills', SKILLS[0])), false);
  assert.ok(existsSync(join(f.cwd, '.claude', 'skills', SKILLS[0])));
});

test('remove --local: project command selection preserves the home copy', async t => {
  const f = await fixture(t, ['commands-project']);
  const command = [...COMMANDS, ...LEGACY_COMMANDS][0];
  assert.ok(command, 'fixture needs a current or retired command');
  for (const dir of [f.home, f.cwd]) {
    await mkdir(join(dir, '.claude', 'commands'), { recursive: true });
    await writeFile(join(dir, '.claude', 'commands', `${command}.md`), '# fixture');
  }
  await f.remove();
  assert.ok((await f.choices()).some(choice => choice.value === 'commands-project'));
  assert.equal(existsSync(join(f.cwd, '.claude', 'commands', `${command}.md`)), false);
  assert.ok(existsSync(join(f.home, '.claude', 'commands', `${command}.md`)));
});

test('mirror removal requires selection in both scopes', async t => {
  const f = await fixture(t, []);
  await f.remove();
  const choices = await f.choices();
  for (const value of ['symlinks-home', 'symlinks-project']) {
    assert.equal(choices.find(choice => choice.value === value)?.checked, false);
  }
  assert.ok(existsSync(join(f.home, '.claude', 'skills', SKILLS[0])));
  assert.ok(existsSync(join(f.cwd, '.claude', 'skills', SKILLS[0])));
});
