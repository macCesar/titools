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

// Two lines of description per skill: enough to tell what a skill is for,
// short enough that the list stays a list. Everything past that is the
// skill's trigger text, which is written for the agent, not for this screen.
const MAX_DESCRIPTION_LINES = 2;

// Descriptions still need room to say something when the window is narrow.
const MIN_DESCRIPTION_WIDTH = 24;

/**
 * Unquote a YAML scalar. Most skills here are single-quoted because the
 * descriptions contain colons and apostrophes; without this, the quote is
 * printed as part of the text.
 * @param {string} value - Raw scalar as it appears after `description:`
 * @returns {string} The value with its wrapping quotes and escapes resolved
 */
function unquote(value) {
  const text = value.trim();
  const quote = text[0];
  if ((quote !== "'" && quote !== '"') || !text.endsWith(quote) || text.length < 2) {
    return text;
  }
  const inner = text.slice(1, -1);
  // In single-quoted YAML an apostrophe is escaped by doubling it.
  return quote === "'" ? inner.replace(/''/g, "'") : inner.replace(/\\"/g, '"');
}

/**
 * Wrap text into aligned lines, capped at maxLines with an ellipsis when it
 * does not fit.
 * @param {string} text - Text to wrap
 * @param {number} width - Columns available for the text itself
 * @param {number} maxLines - Hard cap on the number of lines
 * @returns {string[]} Lines, none longer than width
 */
export function wrapDescription(text, width, maxLines = MAX_DESCRIPTION_LINES) {
  const columns = Math.max(width, MIN_DESCRIPTION_WIDTH);
  const lines = [];
  let current = '';

  for (let word of text.split(/\s+/).filter(Boolean)) {
    // A single word wider than the column (a long URL) is broken by hand;
    // otherwise the loop below could never place it and would spin.
    while (word.length > columns) {
      if (current) {
        lines.push(current);
        current = '';
      }
      lines.push(word.slice(0, columns));
      word = word.slice(columns);
    }

    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= columns) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (lines.length <= maxLines) return lines;

  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  if (last.length + 1 > columns) {
    last = last.slice(0, columns - 1).replace(/\s+\S*$/, '');
  }
  kept[maxLines - 1] = `${last.replace(/[,;:]$/, '')}…`;
  return kept;
}

/**
 * Extract the skill's short description from SKILL.md — the first sentence of
 * the frontmatter description, unquoted and collapsed to a single line.
 *
 * The sentence ends at a period followed by whitespace, which avoids breaking
 * on "SDK 13." and other version-number periods.
 * @param {string} frontmatter - The YAML block between the --- fences
 * @returns {string|null} The description, or null when there is none
 */
export function parseDescription(frontmatter) {
  // The lookahead ends the value at the next top-level key, or at the end of
  // the block. `(?![\s\S])` rather than `$`, which under the /m flag would
  // match the first newline and cut a description written across two lines.
  const descMatch = frontmatter.match(/^description:\s*([\s\S]+?)(?=\n[A-Za-z][\w-]*:|(?![\s\S]))/m);
  if (!descMatch) return null;

  const full = unquote(descMatch[1]).replace(/\s+/g, ' ').trim();
  if (!full) return null;

  const firstSentence = full.match(/^([^]*?\.)\s/);
  if (firstSentence) return firstSentence[1].trim();
  return full;
}

/**
 * Read a skill's description from disk.
 * @param {string} skillDir - Directory holding the skill's SKILL.md
 * @returns {{description: string|null, installed: boolean}}
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

    return { description: parseDescription(frontmatter[1]), installed: true };
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

  // Where the description column starts: '  ' + mark + ' ' + padded name + ' '.
  // Measured on the plain text, since chalk's colour codes take no columns.
  const descriptionColumn = 2 + 1 + 1 + (maxNameLen + 2) + 1;
  const available = (process.stdout.columns || 80) - descriptionColumn;

  // Print aligned rows
  for (const row of rows) {
    const mark = row.installed ? CHECK : CROSS;
    const paddedName = row.name.padEnd(maxNameLen + 2);
    const text = row.description || (row.installed ? '(no description)' : 'not installed');
    const [first, ...rest] = wrapDescription(text, available);

    console.log(`  ${mark} ${chalk.cyan(paddedName)} ${chalk.gray(first)}`);
    for (const line of rest) {
      console.log(`${' '.repeat(descriptionColumn)}${chalk.gray(line)}`);
    }
  }

  console.log('');
  console.log(chalk.gray(`${installedCount}/${SKILLS.length} installed at ${skillsDir}`));
  console.log('');
  console.log(chalk.gray('Run `titools status` for installation health.'));
  console.log(chalk.gray('Run `titools doctor` to diagnose issues.'));
  console.log('');
}

export default listCommand;
