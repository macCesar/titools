/**
 * List command
 * Enumerates available Titanium skills with a short description.
 * Reads each skill's SKILL.md frontmatter — no hardcoded list.
 */

import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  SKILLS,
  PACKAGE_VERSION,
  getAgentsSkillsDir,
} from '../config.js';

const CHECK = chalk.green('✓');
const CROSS = chalk.red('✗');

/**
 * Extract the skill's human-readable name and short description from SKILL.md.
 * Returns { description, installed } where description is the first sentence of
 * the frontmatter description, trimmed for terminal display.
 */
function readSkillMetadata(skillDir) {
  const skillMd = join(skillDir, 'SKILL.md');
  if (!existsSync(skillMd)) {
    return { description: null, installed: false };
  }

  try {
    const content = readFileSync(skillMd, 'utf8');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) return { description: null, installed: true };

    const descMatch = frontmatter[1].match(/description:\s*"([^"]+)"|description:\s*(.+)/);
    if (!descMatch) return { description: null, installed: true };

    const full = descMatch[1] || descMatch[2] || '';
    // First sentence: period followed by whitespace (avoids breaking on "SDK 13."
    // or other version-number periods). Falls back to a word-safe length cutoff.
    let short;
    const firstSentence = full.match(/^([^]*?\.)\s/);
    if (firstSentence) {
      short = firstSentence[1];
    } else if (full.length > 80) {
      const cut = full.slice(0, 80);
      short = cut.slice(0, cut.lastIndexOf(' ')) + '…';
    } else {
      short = full;
    }
    return { description: short.trim(), installed: true };
  } catch {
    return { description: null, installed: true };
  }
}

export async function listCommand() {
  console.log('');
  console.log(chalk.bold.blue(`Titanium skills (v${PACKAGE_VERSION})`));
  console.log('');

  const skillsDir = getAgentsSkillsDir();

  if (!existsSync(skillsDir)) {
    console.log(chalk.yellow('No skills installed yet.'));
    console.log('Install with:');
    console.log(chalk.cyan('  titools install'));
    console.log('');
    return;
  }

  const rows = [];
  let installedCount = 0;
  let maxNameLen = 0;

  for (const name of SKILLS) {
    const skillDir = join(skillsDir, name);
    const { description, installed } = readSkillMetadata(skillDir);

    if (installed) installedCount++;
    if (name.length > maxNameLen) maxNameLen = name.length;

    rows.push({ name, description, installed });
  }

  // Print aligned rows
  for (const row of rows) {
    const mark = row.installed ? CHECK : CROSS;
    const paddedName = row.name.padEnd(maxNameLen + 2);
    const desc = row.description
      ? chalk.gray(row.description)
      : chalk.gray(row.installed ? '(no description)' : 'not installed');

    console.log(`  ${mark} ${chalk.cyan(paddedName)} ${desc}`);
  }

  console.log('');
  console.log(chalk.gray(`${installedCount}/${SKILLS.length} installed at ${skillsDir}`));
  console.log('');
  console.log(chalk.gray('Run `titools status` for installation health.'));
  console.log(chalk.gray('Run `titools doctor` to diagnose issues.'));
  console.log('');
}

export default listCommand;
