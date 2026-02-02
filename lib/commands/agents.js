/**
 * Agents command
 * Adds AGENTS.md/CLAUDE.md/GEMINI.md to Titanium projects
 */

import chalk from 'chalk';
import ora from 'ora';
import {
  getAgentsSkillsDir,
  SKILLS,
} from '../config.js';
import checkbox, { Separator } from '../prompts/checkboxCancel.js';
import {
  isTitaniumProject,
  detectTitaniumVersion,
  addOrUpdateBlock,
  blockExists,
  removeOldBlock,
} from '../utils.js';
import { existsSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Agents command handler
 * @param {string} projectPath - Project path argument
 * @param {Object} options - Command options
 */
export async function agentsCommand(projectPath, options) {
  const effectiveOptions = options || {};
  const inline = !!effectiveOptions.inline;
  if (!inline) {
    console.log('');
  }
  console.log(chalk.bold.blue('Titanium AI Knowledge Manager'));
  console.log('');

  // Resolve project path
  const projectDir = resolve(projectPath);

  // Verify this is a Titanium project
  if (!isTitaniumProject(projectDir)) {
    console.log(chalk.red('Error: Not a Titanium project (no tiapp.xml)'));
    console.log('Run this command from the project root.');
    process.exit(1);
  }
  // Check for local vs global skills
  const localSkillsPaths = {
    'CLAUDE.md': join(projectDir, '.claude', 'skills'),
    'GEMINI.md': join(projectDir, '.gemini', 'skills'),
    'AGENTS.md': join(projectDir, '.agents', 'skills'),
  };

  const agentsSkillsDir = getAgentsSkillsDir();
  const hasSkillsAt = (skillsDir) =>
    skillsDir && SKILLS.some((skill) => existsSync(join(skillsDir, skill)));
  const hasGlobalSkills = hasSkillsAt(agentsSkillsDir);
  const hasAnyLocalSkills = Object.values(localSkillsPaths).some(hasSkillsAt);

  // Verify skills are installed (either global or local)
  if (!hasGlobalSkills && !hasAnyLocalSkills) {
    console.log(chalk.red('Error: Skills not installed.'));
    console.log(`${chalk.bold('Run:')} ${chalk.cyan('titools install')}`);
    if (options?.verbose) {
      console.log(
        chalk.gray(
          `Searched: ${agentsSkillsDir} | ./.agents/skills, ./.claude/skills, ./.gemini/skills`
        )
      );
    }
    process.exit(1);
  }

  // Detect Titanium version
  const tiVersion = detectTitaniumVersion(projectDir);
  console.log(chalk.green('✓'), `Titanium project (SDK ${tiVersion})`);
  console.log('');

  // Define potential files
  const possibleFiles = [
    { name: 'AGENTS.md', value: 'AGENTS.md' },
    { name: 'CLAUDE.md', value: 'CLAUDE.md' },
    { name: 'GEMINI.md', value: 'GEMINI.md' },
  ];

  // Get current state of files
  const fileStates = possibleFiles.map(f => {
    const filePath = join(projectDir, f.value);
    return {
      ...f,
      exists: existsSync(filePath),
      hasBlock: blockExists(filePath)
    };
  });

  // Determine which files to process
  let selectedFiles = [];

  if (effectiveOptions.onlyExisting) {
    selectedFiles = fileStates.filter(f => f.exists).map(f => f.value);
  } else if (effectiveOptions.force) {
    selectedFiles = fileStates.filter(f => f.hasBlock).map(f => f.value);
    if (selectedFiles.length === 0) selectedFiles = ['CLAUDE.md'];
  } else {
    try {
      selectedFiles = await checkbox({
        message: 'Select instruction files to sync:',
        choices: [
          ...fileStates.map(f => ({
            name: f.name,
            value: f.value,
            checked: f.hasBlock
          })),
          new Separator(' ')
        ],
        shortcuts: { invert: null },
        theme: {
          style: {
            renderSelectedChoices: () => '',
          },
        },
      });
    } catch (error) {
      console.log('\nCancelled.');
      process.exit(0);
    }
  }

  // Handle cancellation
  if (selectedFiles.includes('cancel')) {
    console.log('Cancelled.');
    return;
  }

  // If nothing selected, proceed to remove knowledge from all existing files
  if (selectedFiles.length === 0) {
    console.log(chalk.yellow('No selection. Removing knowledge index from all files.'));
  }

  // Process each file
  const spinner = ora();
  const updated = [];
  const removed = [];

  for (const f of fileStates) {
    const filename = f.value;
    const filePath = join(projectDir, filename);
    const isSelected = selectedFiles.includes(filename);

    if (isSelected) {
      // ADD or UPDATE
      spinner.start(`${f.hasBlock ? 'Updating' : 'Adding'} knowledge index in ${filename}...`);

      try {
        if (!f.exists && !existsSync(filePath)) {
          writeFileSync(filePath, `# ${filename}\n\n`, 'utf8');
        }

        let rootPath = '~/.agents/skills';
        const localPath = localSkillsPaths[filename];
        if (localPath && existsSync(localPath)) {
          rootPath = `./${filename === 'CLAUDE.md' ? '.claude' : filename === 'GEMINI.md' ? '.gemini' : '.agents'}/skills`;
        } else {
          if (filename === 'CLAUDE.md') rootPath = '~/.claude/skills';
          if (filename === 'GEMINI.md') rootPath = '~/.gemini/skills';
        }

        addOrUpdateBlock(filePath, rootPath);
        spinner.succeed(`${filename} updated`);
        updated.push(filename);
      } catch (error) {
        spinner.fail(`Failed to sync ${filename}: ${error.message}`);
      }
    } else if (f.hasBlock) {
      // REMOVE block if it was previously there but now unselected
      spinner.start(`Removing knowledge index from ${filename}...`);
      try {
        removeOldBlock(filePath);
        spinner.succeed(`${filename} knowledge index removed`);
        removed.push(filename);
      } catch (error) {
        spinner.fail(`Failed to clean ${filename}: ${error.message}`);
      }
    }
  }

  if (!inline) {
    console.log('');
  }
  if (updated.length > 0 || removed.length > 0) {
    const updatedText = updated.length > 0 ? ` Updated: ${updated.join(', ')}` : '';
    const cleanedText = removed.length > 0 ? ` Cleaned: ${removed.join(', ')}` : '';
    console.log('');
    console.log(chalk.green(`✓ sync complete!${updatedText}${cleanedText}`));
  } else {
    console.log(chalk.yellow('No changes made.'));
  }
  if (!inline) {
    console.log('');
  }
}

export default agentsCommand;
