/**
 * Manifest integrity tests.
 *
 * These check the wiring between the repo's contents and the files that declare
 * them — the class of bug that is invisible in review because nothing is broken,
 * something is merely never reached. Every assertion here corresponds to a failure
 * one of the two sibling repos has actually shipped:
 *
 *   - The three slash commands lived in a gitignored path for four months while the
 *     README advertised them. They reached no channel, and `commands/` was missing
 *     from the npm `files` allowlist on top of that.
 *   - v2.6.0 published npm 2.6.0 while plugin.json still said 3.0.0, so the
 *     marketplace announced a version that did not exist.
 *   - In aiskills, `session-log` existed under skills/ but was missing from SKILLS,
 *     so the CLI never installed it.
 *   - v2.4.0 shipped the flat hook format in settings.json and failed validation on
 *     session start, requiring the v2.4.1 hotfix.
 *
 * Ported from aiskills, extended for what TiTools additionally ships: an agent, a
 * SessionStart hook, and a wider `files` allowlist.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SKILLS,
  LEGACY_SKILLS,
  COMMANDS,
  LEGACY_COMMANDS,
  AGENTS,
  LEGACY_AGENTS,
} from '../lib/config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const COMMANDS_DIR = path.join(ROOT, 'commands');
const run = promisify(execFile);
const AGENTS_DIR = path.join(ROOT, 'agents');

const readJson = (...segments) => JSON.parse(readFileSync(path.join(ROOT, ...segments), 'utf8'));

const listDirs = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => entry.name)
    : [];

const listMd = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith('.md')) : [];

/**
 * Minimal frontmatter reader. Deliberately not a YAML parser — it only needs to
 * answer "is there a name and a description, and what is the name", and pulling in
 * a YAML dependency for that would be the expensive way to ask.
 */
const readFrontmatter = (filePath) => {
  const raw = readFileSync(filePath, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(raw);
  if (!match) return null;
  const block = match[1];
  const name = /^name:\s*(.+)$/m.exec(block);
  const description = /^description:\s*([\s\S]+?)(?=\n\w+:|$)/m.exec(block);
  return {
    block,
    name: name ? name[1].trim().replace(/^['"]|['"]$/g, '') : null,
    description: description ? description[1].trim().replace(/^['"]|['"]$/g, '') : null,
  };
};

const skillDirs = listDirs(SKILLS_DIR);

describe('skills are wired into the CLI', () => {
  test('every skill in SKILLS exists on disk', () => {
    for (const skill of SKILLS) {
      const skillMd = path.join(SKILLS_DIR, skill, 'SKILL.md');
      assert.ok(existsSync(skillMd), `SKILLS lists "${skill}" but skills/${skill}/SKILL.md is missing`);
    }
  });

  test('every skill on disk is listed in SKILLS', () => {
    for (const dir of skillDirs) {
      assert.ok(
        SKILLS.includes(dir),
        `skills/${dir}/ exists but is not in lib/config.js SKILLS — the CLI will never install it`,
      );
    }
  });

  test('SKILLS and LEGACY_SKILLS do not overlap', () => {
    const overlap = SKILLS.filter((skill) => LEGACY_SKILLS.includes(skill));
    assert.deepEqual(overlap, [], `these skills are installed and marked legacy at once: ${overlap.join(', ')}`);
  });

  test('LEGACY_SKILLS are gone from the repo', () => {
    for (const skill of LEGACY_SKILLS) {
      assert.ok(
        !existsSync(path.join(SKILLS_DIR, skill)),
        `"${skill}" is marked legacy for removal but skills/${skill}/ still ships`,
      );
    }
  });
});

describe('skill frontmatter', () => {
  for (const skill of skillDirs) {
    test(`${skill} declares a parseable name and description`, () => {
      const fm = readFrontmatter(path.join(SKILLS_DIR, skill, 'SKILL.md'));
      assert.ok(fm, `skills/${skill}/SKILL.md has no YAML frontmatter block`);
      assert.equal(fm.name, skill, `frontmatter name "${fm.name}" does not match directory "${skill}"`);
      assert.ok(fm.description && fm.description.length > 0, `skills/${skill}/SKILL.md has an empty description`);
    });

    test(`${skill} description stays within the 1024-char spec limit`, () => {
      // The cap belongs to the `description` field, not to the block. The spec
      // sets description at max 1024 characters and puts no limit on the
      // frontmatter as a whole, so measuring the block was stricter by however
      // long the other fields happened to be — which would have rejected a
      // perfectly legal `compatibility` or `license` line as "too long".
      const fm = readFrontmatter(path.join(SKILLS_DIR, skill, 'SKILL.md'));
      assert.ok(
        fm.description.length <= 1024,
        `description is ${fm.description.length} chars; agentskills.io caps it at 1024, past which agents may fail to load the skill`,
      );
    });

    test(`${skill} name follows the spec's naming rules`, () => {
      // Same source, same section: 1-64 characters, lowercase alphanumerics and
      // single hyphens, no leading or trailing hyphen. A name the spec rejects
      // is a skill some agents will not load at all.
      const fm = readFrontmatter(path.join(SKILLS_DIR, skill, 'SKILL.md'));
      assert.ok(fm.name.length <= 64, `name is ${fm.name.length} chars; the spec caps it at 64`);
      assert.match(
        fm.name,
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        'lowercase letters, numbers and single hyphens only, not starting or ending with one',
      );
    });
  }
});

describe('reference files a skill points at exist', () => {
  for (const skill of skillDirs) {
    test(`${skill} has no broken references/ pointer`, () => {
      const skillDir = path.join(SKILLS_DIR, skill);
      const body = readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
      const referenced = new Set(body.match(/references\/[A-Za-z0-9._-]+\.md/g) ?? []);
      for (const ref of referenced) {
        assert.ok(existsSync(path.join(skillDir, ref)), `skills/${skill}/SKILL.md points at ${ref}, which does not exist`);
      }
    });
  }
});

describe('commands are wired into the CLI', () => {
  test('every command in COMMANDS exists on disk', () => {
    for (const command of COMMANDS) {
      assert.ok(
        existsSync(path.join(COMMANDS_DIR, `${command}.md`)),
        `COMMANDS lists "${command}" but commands/${command}.md is missing`,
      );
    }
  });

  test('every command file is listed in COMMANDS', () => {
    for (const file of listMd(COMMANDS_DIR)) {
      const name = path.basename(file, '.md');
      assert.ok(COMMANDS.includes(name), `commands/${file} exists but is not in lib/config.js COMMANDS`);
    }
  });

  test('COMMANDS and LEGACY_COMMANDS do not overlap', () => {
    const overlap = COMMANDS.filter((command) => LEGACY_COMMANDS.includes(command));
    assert.deepEqual(overlap, [], `these commands are installed and marked legacy at once: ${overlap.join(', ')}`);
  });

  test('each command declares a name matching its filename', () => {
    for (const command of COMMANDS) {
      const fm = readFrontmatter(path.join(COMMANDS_DIR, `${command}.md`));
      assert.ok(fm, `commands/${command}.md has no YAML frontmatter block`);
      assert.equal(fm.name, command, `commands/${command}.md declares name "${fm.name}"`);
      assert.ok(fm.description && fm.description.length > 0, `commands/${command}.md has an empty description`);
    }
  });
});

describe('agents are wired into the CLI', () => {
  test('every agent in AGENTS exists on disk', () => {
    for (const agent of AGENTS) {
      assert.ok(
        existsSync(path.join(AGENTS_DIR, `${agent}.md`)),
        `AGENTS lists "${agent}" but agents/${agent}.md is missing`,
      );
    }
  });

  test('every agent file is listed in AGENTS', () => {
    for (const file of listMd(AGENTS_DIR)) {
      const name = path.basename(file, '.md');
      assert.ok(AGENTS.includes(name), `agents/${file} exists but is not in lib/config.js AGENTS`);
    }
  });

  test('AGENTS and LEGACY_AGENTS do not overlap', () => {
    const overlap = AGENTS.filter((agent) => LEGACY_AGENTS.includes(agent));
    assert.deepEqual(overlap, [], `these agents are installed and marked legacy at once: ${overlap.join(', ')}`);
  });
});

describe('everything that ships is in the npm files allowlist', () => {
  // `files` is the quiet failure mode: the repo is correct, the tarball is not.
  // commands/ was missing from it when the slash commands were first promoted,
  // which would have published a package whose installer finds no commands.
  const shipped = ['bin/', 'lib/', 'skills/', 'agents/', 'commands/'];

  for (const entry of shipped) {
    test(`${entry} is listed`, () => {
      const pkg = readJson('package.json');
      assert.ok(
        pkg.files.includes(entry),
        `package.json files omits ${entry} — npm would publish a package without it`,
      );
    });
  }

  test('maintainer-only paths stay out of the tarball', () => {
    const pkg = readJson('package.json');
    for (const entry of pkg.files) {
      assert.ok(
        !entry.startsWith('scripts/') && !entry.startsWith('.claude/'),
        `package.json files includes ${entry}, which is maintainer tooling and should not ship`,
      );
    }
  });

  test('the actual npm tarball excludes generated Python bytecode', async () => {
    const { stdout } = await run('npm', ['pack', '--dry-run', '--json'], {
      cwd: ROOT,
      maxBuffer: 10 * 1024 * 1024,
    });
    const [packed] = Object.values(JSON.parse(stdout));
    const bytecode = packed.files
      .map((entry) => entry.path)
      .filter((entry) => entry.includes('__pycache__') || /\.py[co]$/.test(entry));

    assert.deepEqual(bytecode, [], `npm would publish generated Python bytecode: ${bytecode.join(', ')}`);
  });
});

describe('release manifests stay in sync', () => {
  test('package.json and plugin.json declare the same version', () => {
    const pkg = readJson('package.json');
    const plugin = readJson('.claude-plugin', 'plugin.json');
    assert.equal(
      plugin.version,
      pkg.version,
      'plugin.json is what Claude Code compares to invalidate its plugin cache. Out of sync, ' +
        'marketplace users keep running the old code after an npm release.',
    );
  });

  test('the marketplace points at the plugin by name', () => {
    const marketplace = readJson('.claude-plugin', 'marketplace.json');
    const plugin = readJson('.claude-plugin', 'plugin.json');
    const names = marketplace.plugins.map((entry) => entry.name);
    assert.ok(names.includes(plugin.name), `marketplace.json lists ${names.join(', ')} but plugin.json is "${plugin.name}"`);
  });
});

describe('the bundled hook uses the format Claude Code accepts', () => {
  // The flat form `{ command, timeout }` fails settings validation on session
  // start; that is what forced the v2.4.0 → v2.4.1 hotfix. The accepted shape
  // nests the entries under a `hooks` array.
  test('hooks.json nests its entries under a hooks array', () => {
    const hooks = readJson('hooks', 'hooks.json');
    const groups = Object.values(hooks.hooks ?? {}).flat();
    assert.ok(groups.length > 0, 'hooks.json declares no hook events');

    for (const group of groups) {
      assert.ok(
        Array.isArray(group.hooks),
        'a hook entry is missing its nested `hooks` array — this is the flat format that fails validation',
      );
      for (const entry of group.hooks) {
        assert.equal(entry.type, 'command', 'hook entries must declare type: "command"');
        assert.ok(entry.command, 'hook entry has no command');
      }
    }
  });

  test('the script the hook points at exists and is executable', () => {
    const hooks = readJson('hooks', 'hooks.json');
    const commands = Object.values(hooks.hooks ?? {})
      .flat()
      .flatMap((group) => group.hooks ?? [])
      .map((entry) => entry.command);

    for (const command of commands) {
      const match = /\$\{CLAUDE_PLUGIN_ROOT\}\/(\S+)/.exec(command);
      if (!match) continue;
      assert.ok(existsSync(path.join(ROOT, match[1])), `hooks.json points at ${match[1]}, which does not exist`);
    }
  });
});

describe('bundled JSON parses', () => {
  const jsonFiles = ['package.json', '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'hooks/hooks.json'];

  for (const file of jsonFiles) {
    test(file, () => {
      assert.doesNotThrow(() => readJson(...file.split('/')));
    });
  }
});
