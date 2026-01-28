#!/usr/bin/env node

/**
 * PurgeTSS Project Detection Script
 *
 * This script detects if the current project uses PurgeTSS by checking:
 * 1. purgetss/ folder exists in project root
 * 2. purgetss/config.cjs exists
 * 3. purgetss/styles/tailwind.tss exists
 *
 * Usage: node detect.js [project_path]
 *
 * Returns: 0 if PurgeTSS detected, 1 if not
 */

const fs = require('fs');
const path = require('path');

function detectPurgeTSS(projectPath = process.cwd()) {
  const checks = [
    path.join(projectPath, 'purgetss'),
    path.join(projectPath, 'purgetss', 'config.cjs'),
    path.join(projectPath, 'purgetss', 'styles', 'tailwind.tss'),
    path.join(projectPath, 'app', 'styles', 'app.tss'),
  ];

  const exists = checks.filter(p => fs.existsSync(p));

  return {
    detected: exists.length >= 2, // Requires at least 2 indicators
    indicators: exists,
    confidence: exists.length >= 3 ? 'high' : exists.length >= 2 ? 'medium' : 'none'
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const result = detectPurgeTSS(projectPath);

  if (result.detected) {
    console.log(`PurgeTSS detected (${result.confidence} confidence)`);
    console.log('Indicators:', result.indicators);
    process.exit(0);
  } else {
    console.log('PurgeTSS NOT detected');
    process.exit(1);
  }
}

module.exports = { detectPurgeTSS };
