#!/usr/bin/env node

/**
 * titools - Titanium SDK Skills CLI Tool
 * Main entry point for the NPM package
 */

import { Command } from 'commander';
import { PACKAGE_VERSION } from '../lib/config.js';
import { installCommand } from '../lib/commands/install.js';
import { agentsCommand } from '../lib/commands/agents.js';
import { updateCommand } from '../lib/commands/update.js';
import { uninstallCommand } from '../lib/commands/uninstall.js';

const program = new Command();

program
  .name('titools')
  .description('Titanium SDK Skills CLI - Manage skills and agents for AI coding assistants')
  .version(PACKAGE_VERSION);

// Install command
program
  .command('install')
  .description('Install Titanium skills and agents to your AI coding assistant')
  .option('-a, --all', 'Install to all detected platforms without prompting')
  .option('--path <path>', 'Install to a custom path (skips symlink setup)')
  .action(installCommand);

// Agents command
program
  .command('agents')
  .description('Add AGENTS.md/CLAUDE.md/GEMINI.md to your Titanium project')
  .argument('[path]', 'Project path (defaults to current directory)', '.')
  .option('-f, --force', 'Overwrite existing files without prompting')
  .action(agentsCommand);

// Update command
program
  .command('update')
  .description('Update Titanium skills and docs to the latest version')
  .action(updateCommand);

// Uninstall command
program
  .command('uninstall')
  .description('Remove Titanium skills and agents')
  .action(uninstallCommand);

// Parse arguments
program.parse();

export { program };
