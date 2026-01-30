/**
 * Agents command
 * Adds AGENTS.md/CLAUDE.md/GEMINI.md to Titanium projects
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import {
  getAgentsDir,
  AGENTS_TEMPLATE_FILE,
  TITANIUM_PROJECT_FILE,
  AI_FILE_PRIORITIES,
} from '../config.js';
import {
  isTitaniumProject,
  detectTitaniumVersion,
  getAIFiles,
  determineFilesToUpdate,
  addOrUpdateBlock,
} from '../utils.js';
import { existsSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Agents command handler
 * @param {string} projectPath - Project path argument
 * @param {Object} options - Command options
 */
export async function agentsCommand(projectPath, options) {
  console.log('');
  console.log(chalk.bold.blue('Titanium AGENTS.md Installer'));
  console.log('');

  // Resolve project path
  const projectDir = resolve(projectPath);

  // Verify template exists
  const agentsDir = getAgentsDir();
  const templatePath = join(agentsDir, AGENTS_TEMPLATE_FILE);

  if (!existsSync(templatePath)) {
    console.log(chalk.red('Error: AGENTS-TEMPLATE.md not found'));
    console.log('Install titools first:');
    console.log('  titools install');
    console.log('');
    console.log('Or run the full installer:');
    console.log('  curl -fsSL https://raw.githubusercontent.com/macCesar/titools/main/install.sh | bash');
    process.exit(1);
  }

  // Verify this is a Titanium project
  if (!isTitaniumProject(projectDir)) {
    console.log(chalk.red('Error: Not a Titanium project (no tiapp.xml)'));
    console.log('Run this command from your project root.');
    process.exit(1);
  }

  // Detect Titanium version
  const tiVersion = detectTitaniumVersion(projectDir);
  console.log(chalk.green('✓'), `Titanium project (SDK ${tiVersion})`);
  console.log('');

  // Check which AI files exist
  const aiFiles = getAIFiles(projectDir);

  // Determine which files to update
  let filesToUpdate = determineFilesToUpdate(aiFiles);

  // If no files exist, ask which AI they use
  if (filesToUpdate.length === 0) {
    if (options.force) {
      // Default to CLAUDE.md if force mode
      filesToUpdate = ['CLAUDE.md'];
    } else {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'ai',
          message: 'Which AI assistant are you using?',
          choices: [
            { name: 'Claude Code (creates CLAUDE.md)', value: 'CLAUDE.md' },
            { name: 'Gemini CLI (creates GEMINI.md)', value: 'GEMINI.md' },
            { name: 'Cursor/Copilot (creates AGENTS.md)', value: 'AGENTS.md' },
          ],
        },
      ]);
      filesToUpdate = [answers.ai];
    }
  }

  // Update each file
  const spinner = ora();
  const updated = [];

  for (const filename of filesToUpdate) {
    const filePath = join(projectDir, filename);

    // Create file if it doesn't exist
    if (!existsSync(filePath)) {
      writeFileSync(filePath, '', 'utf8');
    }

    spinner.start(`Updating ${filename}...`);

    try {
      addOrUpdateBlock(filePath, templatePath);
      spinner.succeed(`${filename} updated`);
      updated.push(filename);
    } catch (error) {
      spinner.fail(`Failed to update ${filename}: ${error.message}`);
    }
  }

  console.log('');
  console.log(chalk.green('✓'), `Done! Updated: ${updated.join(', ')}`);
  console.log('');

  // Show notes for multiple files
  if (updated.length > 1) {
    console.log(
      chalk.cyan('Note:'),
      `Updated ${updated.length} files - Titanium knowledge synced across all.`
    );
    console.log('');
  }
}

export default agentsCommand;
