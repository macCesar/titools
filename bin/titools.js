#!/usr/bin/env node

/**
 * titools - Titanium SDK Skills CLI Tool
 * Main entry point for the NPM package
 */

import { Command } from 'commander';
import { PACKAGE_VERSION } from '../lib/config.js';
import { skillsCommand } from '../lib/commands/skills.js';
import { agentsCommand } from '../lib/commands/agents.js';
import { updateCommand } from '../lib/commands/update.js';
import { uninstallCommand } from '../lib/commands/uninstall.js';

const program = new Command();

program
  .name('titools')
  .description('Titanium SDK Skills CLI - Manage skills and agents for AI coding assistants')
  .version(PACKAGE_VERSION);

// Skills command
program
  .command('skills')
  .description('Sync Titanium skills and platform links')
  .option('-l, --local', 'Sync skills locally in the current project')
  .option('-a, --all', 'Sync all detected platforms without prompting')
  .option('--path <path>', 'Sync to a custom path (skips symlink setup)')
  .action(skillsCommand);

// Agents command
program
  .command('agents')
  .description('Sync instruction files (AGENTS.md/CLAUDE.md/GEMINI.md) in a Titanium project')
  .argument('[path]', 'Project path (defaults to current directory)', '.')
  .option('-f, --force', 'Overwrite existing files without prompting')
  .action(agentsCommand);

// Update command
program
  .command('update')
  .description('Update installed skills/agents (not the CLI)')
  .option('-l, --local', 'Update local skills in the current project')
  .action(updateCommand);

// Uninstall command
program
  .command('uninstall')
  .description('Remove Titanium skills and agents')
  .option('-l, --local', 'Remove local skills from the current project')
  .action(uninstallCommand);

// Parse arguments
program.parse();

export { program };
