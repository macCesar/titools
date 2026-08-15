/**
 * ESLint flat config.
 *
 * The repo had no ESLint configuration at all: `npm run lint` failed on every
 * run with "couldn't find an eslint.config.js", so the script had been dead
 * since ESLint 9 dropped .eslintrc support. This is that file.
 *
 * Covers the JavaScript this repo actually owns — the CLI entrypoint, the
 * library behind it and the test suite. `skills/` is Markdown, Python and
 * template fragments, and is left alone.
 */

import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'skills/**'],
  },
  {
    files: ['bin/**/*.js', 'lib/**/*.js', 'test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // An unused argument named with a leading underscore is deliberate — it
      // documents a signature the caller must still match.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
];
