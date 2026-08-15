import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

import { parseDescription, wrapDescription } from '../lib/commands/list.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const binPath = join(repoRoot, 'bin', 'titools.js');

// Every `list` assertion runs against a temporary HOME. Reading the real one
// made the result depend on whether the machine happened to have skills
// installed: the suite passed on a developer box and failed on a clean CI
// runner, which is exactly what it did the first time it ran in Actions.
function run(args, home) {
  return new Promise((resolvePromise) => {
    execFile(
      process.execPath,
      [binPath, ...args],
      {
        timeout: 15000,
        env: { ...process.env, HOME: home, USERPROFILE: home },
      },
      (error, stdout, stderr) => {
        resolvePromise({
          code: error?.code ?? 0,
          stdout: stdout.toString(),
          stderr: stderr.toString(),
        });
      },
    );
  });
}

describe('list command', () => {
  let home;

  beforeEach(async () => {
    home = await mkdtemp(join(tmpdir(), 'titools-list-'));
  });

  afterEach(async () => {
    await rm(home, { recursive: true, force: true });
  });

  // Seed an installed skill by writing the SKILL.md `list` reads.
  async function install(name, description) {
    const skillDir = join(home, '.agents', 'skills', name);
    await mkdir(skillDir, { recursive: true });
    await writeFile(
      join(skillDir, 'SKILL.md'),
      `---\nname: ${name}\ndescription: '${description}'\n---\n\n# ${name}\n`,
      'utf8',
    );
  }

  it('prints a skills header', async () => {
    const result = await run(['list'], home);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /Titanium skills/i);
  });

  it('lists every skill from the SKILLS array even when none are installed', async () => {
    const result = await run(['list'], home);
    assert.equal(result.code, 0);
    for (const skill of ['ti-expert', 'purgetss', 'ti-ui']) {
      assert.match(result.stdout, new RegExp(skill), `expected skill "${skill}" in list output`);
    }
  });

  it('describes a skill that is not installed, from the bundled copy', async () => {
    const result = await run(['list'], home);
    assert.equal(result.code, 0);
    // The catalog is only useful before installing if it says what each skill
    // is for, so an uninstalled row must carry more than its own name.
    const row = result.stdout.split('\n').find((line) => line.includes('purgetss'));
    assert.ok(row, 'expected a purgetss row');
    assert.ok(
      row.replace('purgetss', '').trim().length > 20,
      `expected a description next to the skill name, got: ${row}`,
    );
  });

  it('aliases to "ls"', async () => {
    const result = await run(['ls'], home);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /Titanium skills/i);
  });

  it('reports 0 installed and how to install when nothing is there', async () => {
    const result = await run(['list'], home);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /0\/\d+ installed/);
    assert.match(result.stdout, /No skills installed yet/i);
    assert.match(result.stdout, /titools install/);
  });

  it('counts installed skills and points at the directory holding them', async () => {
    await install('purgetss', 'Utility-first styling for Titanium.');
    const result = await run(['list'], home);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /1\/\d+ installed/);
    assert.match(result.stdout, /Utility-first styling for Titanium/);
    assert.doesNotMatch(result.stdout, /No skills installed yet/i);
  });
});

// Both suites below correspond to what this screen actually shipped: skills
// whose frontmatter is single-quoted printed a stray leading `'`, because the
// parser only handled `description: "…"`; and long descriptions were printed
// unwrapped, so the terminal broke them at column zero and the description
// column stopped lining up. Ported from the sibling repo aiskills.

describe('parseDescription', () => {
  it('strips single-quoted YAML', () => {
    const block = "name: demo\ndescription: 'Audit a codebase. Then fix it.'\nallowed-tools: Read";
    assert.equal(parseDescription(block), 'Audit a codebase.');
  });

  it('strips double quotes too', () => {
    const block = 'name: demo\ndescription: "Design advice. More text."\n';
    assert.equal(parseDescription(block), 'Design advice.');
  });

  it('resolves the doubled apostrophe of single-quoted YAML', () => {
    const block = "description: 'Find what''s broken and say so. Nothing else.'\n";
    assert.equal(parseDescription(block), "Find what's broken and say so.");
  });

  it('does not break a sentence on a version number', () => {
    // "SDK 13." is not the end of the sentence — the period is not followed by
    // whitespace-then-nothing, it is part of the version.
    const block = "description: 'Use when targeting Titanium SDK 13.1 and newer. More.'\n";
    assert.equal(parseDescription(block), 'Use when targeting Titanium SDK 13.1 and newer.');
  });

  it('keeps the whole text when there is no sentence break', () => {
    const block = "description: 'A short one with no period'\nallowed-tools: Read";
    assert.equal(parseDescription(block), 'A short one with no period');
  });

  it('collapses a description written across several lines', () => {
    const block = "description: 'First line\n  continues here. Second sentence.'\nallowed-tools: Read";
    assert.equal(parseDescription(block), 'First line continues here.');
  });

  it('returns null when there is no description', () => {
    assert.equal(parseDescription('name: demo\nallowed-tools: Read'), null);
  });
});

describe('wrapDescription', () => {
  // Widths here are at or above the 24-column floor the module enforces;
  // anything narrower is clamped, which is its own test at the end.
  it('breaks on word boundaries, never past the column', () => {
    const lines = wrapDescription('one two three four five six seven eight nine', 24, 5);
    for (const line of lines) {
      assert.ok(line.length <= 24, `"${line}" is ${line.length} columns, over the 24 available`);
    }
    assert.ok(lines.length > 1, 'the text is longer than one line and should have wrapped');
    assert.equal(lines.join(' '), 'one two three four five six seven eight nine');
  });

  it('caps at maxLines and marks the cut with an ellipsis', () => {
    const text = 'one two three four five six seven eight nine ten eleven twelve thirteen';
    const lines = wrapDescription(text, 24, 2);
    assert.equal(lines.length, 2);
    assert.ok(lines[1].endsWith('…'), `expected an ellipsis, got "${lines[1]}"`);
    assert.ok(lines[1].length <= 24);
  });

  it('does not truncate what already fits', () => {
    const lines = wrapDescription('short enough', 40, 2);
    assert.deepEqual(lines, ['short enough']);
    assert.ok(!lines[0].endsWith('…'));
  });

  it('hard-breaks a word wider than the column instead of hanging', () => {
    const lines = wrapDescription('see https://example.com/a/very/long/path/that/never/fits', 24, 4);
    for (const line of lines) {
      assert.ok(line.length <= 24, `"${line}" is ${line.length} columns, over the 24 available`);
    }
  });

  it('a narrow window is clamped to a readable column', () => {
    const lines = wrapDescription('one two three four five six seven eight', 3, 2);
    assert.ok(lines[0].length > 3, 'width is clamped to a readable minimum');
  });
});
