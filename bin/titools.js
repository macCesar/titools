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
import { autoUpdateCommand } from '../lib/commands/auto-update.js';
import { statusCommand } from '../lib/commands/status.js';
import { doctorCommand } from '../lib/commands/doctor.js';
import { listCommand } from '../lib/commands/list.js';

const program = new Command();

program
  .name('titools')
  .description('Titanium SDK Knowledge CLI - Manage skills and knowledge for AI coding assistants')
  .version(PACKAGE_VERSION);

// Install command
program
  .command('install')
  .description('Install Titanium knowledge packages and platform links')
  .option('-l, --local', 'Install skills locally in the current project')
  .option('-a, --all', 'Install all detected platforms without prompting')
  .option('--path <path>', 'Install to a custom path (skips symlink setup)')
  .action(skillsCommand);

// Sync command
program
  .command('sync')
  .description('Sync knowledge index files (AGENTS.md/CLAUDE.md/GEMINI.md) in a Titanium project')
  .argument('[path]', 'Project path (defaults to current directory)', '.')
  .option('-f, --force', 'Overwrite existing files without prompting')
  .option('-v, --verbose', 'Show detailed diagnostics')
  .action(agentsCommand);

// Update command
program
  .command('update')
  .description('Check for newer CLI versions, then sync installed knowledge packages and agent')
  .option('-l, --local', 'Update local skills in the current project')
  .action(updateCommand);

// Remove command
program
  .command('remove')
  .description('Remove Titanium knowledge packages and agent')
  .option('-l, --local', 'Remove local skills from the current project')
  .action(uninstallCommand);

// Auto-update command
program
  .command('auto-update')
  .description('Check for updates and apply silently (used by hooks)')
  .option('-s, --silent', 'Suppress all output except errors')
  .action(autoUpdateCommand);

// Status command
program
  .command('status')
  .description('Show installation status and linked platforms')
  .action(statusCommand);

// Doctor command
program
  .command('doctor')
  .description('Check installation health and diagnose issues')
  .action(doctorCommand);

// List command
program
  .command('list')
  .alias('ls')
  .description('List available Titanium skills with short descriptions')
  .action(listCommand);

// Parse arguments
program.parse();

export { program };
