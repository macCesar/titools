#!/usr/bin/env node

/**
 * Titanium Project Detection Script (for ti-howtos)
 *
 * This script detects if the current project is a Titanium project.
 * Same as other ti-* skills - all Titanium projects benefit from how-tos.
 *
 * Usage: node detect.js [project_path]
 *
 * Returns: 0 if Titanium project detected, 1 if not
 */

const fs = require('fs');
const path = require('path');

function detectTitanium(projectPath = process.cwd()) {
  const hasTiappXml = fs.existsSync(path.join(projectPath, 'tiapp.xml'));

  const indicators = [
    path.join(projectPath, 'tiapp.xml'),
    path.join(projectPath, 'app'),
    path.join(projectPath, 'Resources'),
    path.join(projectPath, 'plugins'), // Titanium plugins
  ];

  const exists = indicators.filter(p => fs.existsSync(p));

  return {
    detected: hasTiappXml,
    isTitanium: hasTiappXml,
    indicators: exists,
    confidence: hasTiappXml ? 'high' : 'none'
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const result = detectTitanium(projectPath);

  if (result.detected) {
    console.log(`Titanium project detected (${result.confidence} confidence)`);
    process.exit(0);
  } else {
    console.log('NOT a Titanium project');
    process.exit(1);
  }
}

module.exports = { detectTitanium };
