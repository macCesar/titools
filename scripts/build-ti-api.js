#!/usr/bin/env node

/**
 * build-ti-api.js — Generates the ti-api skill from titanium-docs API data
 *
 * Usage:
 *   node scripts/build-ti-api.js --source /path/to/titanium-docs/docs/api
 *
 * Reads api.json + .md overview files and generates:
 *   skills/ti-api/SKILL.md
 *   skills/ti-api/references/*.md (15 reference files)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const sourceIdx = args.indexOf('--source');
const SOURCE_DIR = sourceIdx !== -1 ? args[sourceIdx + 1] : '/Users/cesar/Developer/git-clones/titanium-docs/docs/api';
const OUT_DIR = path.resolve(import.meta.dirname, '..', 'skills', 'ti-api');

if (!existsSync(path.join(SOURCE_DIR, 'api.json'))) {
  console.error(`Error: api.json not found in ${SOURCE_DIR}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load api.json
// ---------------------------------------------------------------------------
const apiData = JSON.parse(readFileSync(path.join(SOURCE_DIR, 'api.json'), 'utf8'));

// ---------------------------------------------------------------------------
// API grouping definitions
// ---------------------------------------------------------------------------
const GROUP_DEFS = [
  {
    id: 'api-ui-views',
    title: 'Ti.UI Core Views API Reference',
    apis: [
      'Titanium.UI.View', 'Titanium.UI.Label', 'Titanium.UI.Button',
      'Titanium.UI.ImageView', 'Titanium.UI.ScrollView', 'Titanium.UI.ScrollableView',
      'Titanium.UI.ActivityIndicator', 'Titanium.UI.ActivityIndicatorStyle',
      'Titanium.UI.ProgressBar', 'Titanium.UI.Slider', 'Titanium.UI.Switch',
      'Titanium.UI.MaskedImage', 'Titanium.UI.RefreshControl',
    ],
  },
  {
    id: 'api-ui-windows-navigation',
    title: 'Ti.UI Windows & Navigation API Reference',
    apis: [
      'Titanium.UI.Window', 'Titanium.UI.NavigationWindow', 'Titanium.UI.TabGroup',
      'Titanium.UI.Tab', 'Titanium.UI.AlertDialog', 'Titanium.UI.OptionDialog',
      'Titanium.UI.Notification',
    ],
  },
  {
    id: 'api-ui-text-input',
    title: 'Ti.UI Text & Input API Reference',
    apis: [
      'Titanium.UI.TextField', 'Titanium.UI.TextArea', 'Titanium.UI.SearchBar',
      'Titanium.UI.AttributedString', 'Titanium.UI.Color', 'Titanium.UI.Clipboard',
      'Titanium.UI.Picker', 'Titanium.UI.PickerColumn', 'Titanium.UI.PickerRow',
    ],
  },
  {
    id: 'api-ui-lists',
    title: 'Ti.UI Lists & Tables API Reference',
    apis: [
      'Titanium.UI.ListView', 'Titanium.UI.ListItem', 'Titanium.UI.ListSection',
      'Titanium.UI.ListViewScrollPosition', 'Titanium.UI.TableView',
      'Titanium.UI.TableViewRow', 'Titanium.UI.TableViewSection',
      'Titanium.UI.TableViewScrollPosition',
    ],
  },
  {
    id: 'api-ui-extras',
    title: 'Ti.UI Extras API Reference',
    apis: [
      'Titanium.UI.Animation', 'Titanium.UI.Matrix2D', 'Titanium.UI.Matrix3D',
      'Titanium.UI.WebView', 'Titanium.UI.Toolbar', 'Titanium.UI.ButtonBar',
      'Titanium.UI.TabbedBar', 'Titanium.UI.OptionBar', 'Titanium.UI.Shortcut',
      'Titanium.UI.ShortcutItem', 'Titanium.UI.EmailDialog',
      'Titanium.UI.DashboardView', 'Titanium.UI.DashboardItem',
    ],
  },
  {
    id: 'api-ui-ios',
    title: 'Ti.UI.iOS API Reference',
    apis: Object.keys(apiData).filter(k =>
      k.startsWith('Titanium.UI.iOS') && apiData[k].type !== 'pseudo' &&
      // Exclude physics behaviors (Animator ecosystem)
      !k.match(/Behavior$|Animator$/)
    ).sort(),
  },
  {
    id: 'api-ui-ios-animator',
    title: 'Ti.UI.iOS Animator & Physics API Reference',
    apis: Object.keys(apiData).filter(k =>
      k.startsWith('Titanium.UI.iOS') && apiData[k].type !== 'pseudo' &&
      k.match(/Behavior$|Animator$/)
    ).sort(),
  },
  {
    id: 'api-ui-android',
    title: 'Ti.UI.Android API Reference',
    apis: [
      ...Object.keys(apiData).filter(k =>
        k.startsWith('Titanium.UI.Android') && apiData[k].type !== 'pseudo'
      ).sort(),
      'Titanium.UI.iPad.Popover', 'Titanium.UI.iPad',
    ].filter(k => apiData[k]),
  },
  {
    id: 'api-android',
    title: 'Ti.Android API Reference',
    apis: Object.keys(apiData).filter(k =>
      k.startsWith('Titanium.Android') && apiData[k].type !== 'pseudo'
    ).sort(),
  },
  {
    id: 'api-app-platform',
    title: 'Ti.App & Ti.Platform API Reference',
    apis: [
      ...Object.keys(apiData).filter(k =>
        (k.startsWith('Titanium.App') || k.startsWith('Titanium.Platform')) &&
        apiData[k].type !== 'pseudo'
      ).sort(),
    ],
  },
  {
    id: 'api-media',
    title: 'Ti.Media API Reference',
    apis: Object.keys(apiData).filter(k =>
      k.startsWith('Titanium.Media') && apiData[k].type !== 'pseudo'
    ).sort(),
  },
  {
    id: 'api-data-network',
    title: 'Ti.Network, Ti.Database & Ti.Filesystem API Reference',
    apis: Object.keys(apiData).filter(k =>
      (k.startsWith('Titanium.Network') || k.startsWith('Titanium.Database') ||
       k.startsWith('Titanium.Filesystem')) && apiData[k].type !== 'pseudo'
    ).sort(),
  },
  {
    id: 'api-services',
    title: 'Ti.Geolocation, Ti.Contacts, Ti.Calendar & Ti.WatchSession API Reference',
    apis: [
      ...Object.keys(apiData).filter(k =>
        (k.startsWith('Titanium.Geolocation') || k.startsWith('Titanium.Contacts') ||
         k.startsWith('Titanium.Calendar')) && apiData[k].type !== 'pseudo'
      ).sort(),
      'Titanium.WatchSession',
    ].filter(k => apiData[k]),
  },
  {
    id: 'api-core',
    title: 'Ti Core API Reference',
    apis: [
      'Titanium', 'Titanium.UI', 'Titanium.API', 'Titanium.Accelerometer', 'Titanium.Blob',
      'Titanium.BlobStream', 'Titanium.Buffer', 'Titanium.BufferStream',
      'Titanium.Codec', 'Titanium.Gesture', 'Titanium.IOStream', 'Titanium.Locale',
      'Titanium.Stream', 'Titanium.Utils', 'Titanium.Proxy', 'Titanium.Module',
    ].filter(k => apiData[k]),
  },
  {
    id: 'api-xml-global',
    title: 'Ti.XML & Global API Reference',
    apis: [
      ...Object.keys(apiData).filter(k =>
        k.startsWith('Titanium.XML') && apiData[k].type !== 'pseudo'
      ).sort(),
      ...Object.keys(apiData).filter(k =>
        k.startsWith('Global') && apiData[k].type !== 'pseudo'
      ).sort(),
    ].filter(k => apiData[k]),
  },
  {
    id: 'api-modules-map',
    title: 'Modules: Map API Reference',
    apis: Object.keys(apiData).filter(k =>
      k.startsWith('Modules.Map') && apiData[k].type !== 'pseudo'
    ).sort(),
  },
  {
    id: 'api-modules-social-misc',
    title: 'Modules: Facebook, Identity, Crypto & More API Reference',
    apis: Object.keys(apiData).filter(k =>
      (k.startsWith('Modules.Facebook') || k.startsWith('Modules.Applesignin') ||
       k.startsWith('Modules.WebDialog') || k.startsWith('Modules.Identity') ||
       k.startsWith('Modules.Crypto') || k.startsWith('Modules.PlayServices') ||
       k.startsWith('Modules.Https') || k.startsWith('Modules.Barcode') ||
       k.startsWith('Modules.EncryptedDatabase') || k.startsWith('Modules.Geofence')) &&
      apiData[k].type !== 'pseudo'
    ).sort(),
  },
  {
    id: 'api-modules-ble-bluetooth',
    title: 'Modules: BLE & Bluetooth API Reference',
    apis: Object.keys(apiData).filter(k =>
      (k.startsWith('Modules.BLE') || k.startsWith('Modules.Bluetooth')) &&
      apiData[k].type !== 'pseudo'
    ).sort(),
  },
  {
    id: 'api-modules-nfc',
    title: 'Modules: NFC API Reference',
    apis: Object.keys(apiData).filter(k =>
      k.startsWith('Modules.Nfc') && apiData[k].type !== 'pseudo'
    ).sort(),
  },
  {
    id: 'api-modules-coremotion-urlsession',
    title: 'Modules: CoreMotion & URLSession API Reference',
    apis: Object.keys(apiData).filter(k =>
      (k.startsWith('Modules.CoreMotion') || k.startsWith('Modules.URLSession')) &&
      apiData[k].type !== 'pseudo'
    ).sort(),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map API name to .md file path */
function apiNameToMdPath(name) {
  // Global -> global.md, Global.Console -> global/console.md
  // Titanium -> titanium.md, Titanium.UI.View -> titanium/ui/view.md
  // Modules.Map -> modules/map.md, Modules.Map.View -> modules/map/view.md
  const parts = name.split('.');
  if (parts.length === 1) {
    return path.join(SOURCE_DIR, parts[0].toLowerCase() + '.md');
  }
  const filePart = parts[parts.length - 1].toLowerCase();
  const dirParts = parts.slice(0, -1).map(p => p.toLowerCase());
  return path.join(SOURCE_DIR, ...dirParts, filePart + '.md');
}

/** Read and clean overview text from .md file */
function getOverview(apiName) {
  const mdPath = apiNameToMdPath(apiName);
  if (!existsSync(mdPath)) return '';

  let content = readFileSync(mdPath, 'utf8');

  // Strip frontmatter
  content = content.replace(/^---[\s\S]*?---\s*/, '');
  // Strip title (# Name)
  content = content.replace(/^#\s+[^\n]+\n/, '');
  // Strip <TypeHeader/> and <ApiDocs/>
  content = content.replace(/<TypeHeader\s*\/>/g, '');
  content = content.replace(/<ApiDocs\s*\/>/g, '');
  // Strip dead URLs
  content = content.replace(/https?:\/\/docs\.appcelerator\.com[^\s)>]*/g, '');
  // Get Overview section only
  const overviewMatch = content.match(/## Overview\s*\n([\s\S]*?)(?=\n## |\n<|$)/);
  if (overviewMatch) {
    content = overviewMatch[1].trim();
  } else {
    content = content.trim();
  }

  // Truncate very long overviews
  const lines = content.split('\n');
  if (lines.length > 15) {
    content = lines.slice(0, 15).join('\n') + '\n\n*(See full overview in titanium-docs)*';
  }

  return content;
}

/** Normalize platform list to compact string */
function platformStr(platforms) {
  if (!platforms || platforms.length === 0) return 'both';
  const names = platforms.map(p => p.name);
  const hasAndroid = names.includes('android');
  const hasIos = names.includes('iphone') || names.includes('ipad') || names.includes('ios');
  if (hasAndroid && hasIos) return 'both';
  if (hasAndroid) return 'android';
  if (hasIos) return 'ios';
  return names.join(', ');
}

/** Format type to compact string */
function typeStr(type) {
  if (!type) return '—';
  if (typeof type === 'string') return type.replace(/^Titanium\./, 'Ti.');
  if (Array.isArray(type)) return type.map(t => typeStr(t)).join(' \\| ');
  if (type.type === 'Array' && type.elementType) return `Array<${typeStr(type.elementType)}>`;
  if (type.type) return typeStr(type.type);
  return '—';
}

/** Escape pipe chars in markdown table cells */
function esc(str) {
  if (!str) return '—';
  return str.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
}

/** Truncate description for table */
function truncDesc(str, maxLen = 80) {
  if (!str) return '—';
  const clean = str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return esc(clean);
  return esc(clean.slice(0, maxLen - 1) + '…');
}

/** Get unique members (not inherited from parent) */
function getUniqueMembers(apiEntry, memberType) {
  const members = apiEntry[memberType] || [];
  return members.filter(m =>
    !m.inherits || m.inherits === apiEntry.name
  );
}

/** Get pseudo types used by an API's properties/methods/events */
function getRelatedPseudos(apiName) {
  const entry = apiData[apiName];
  if (!entry) return [];
  const pseudoNames = new Set();

  const checkType = (type) => {
    if (!type) return;
    if (typeof type === 'string' && apiData[type]?.type === 'pseudo') pseudoNames.add(type);
    if (Array.isArray(type)) type.forEach(checkType);
    if (type?.type) checkType(type.type);
    if (type?.elementType) checkType(type.elementType);
  };

  for (const prop of (entry.properties || [])) {
    if (prop.inherits && prop.inherits !== apiName) continue;
    checkType(prop.type);
  }
  for (const method of (entry.methods || [])) {
    if (method.inherits && method.inherits !== apiName) continue;
    checkType(method.returns?.type);
    for (const param of (method.parameters || [])) {
      checkType(param.type);
    }
  }
  for (const evt of (entry.events || [])) {
    if (evt.inherits && evt.inherits !== apiName) continue;
    for (const prop of (evt.properties || [])) {
      checkType(prop.type);
    }
  }

  return [...pseudoNames].sort();
}

// ---------------------------------------------------------------------------
// Renderers
// ---------------------------------------------------------------------------

function renderPropertiesTable(apiEntry, { compact = false } = {}) {
  const unique = getUniqueMembers(apiEntry, 'properties');
  if (unique.length === 0) return '';

  const total = apiEntry.properties?.length || 0;

  // For entries with many constant-like properties (all caps), render as grouped list
  const constants = unique.filter(p => p.name === p.name.toUpperCase() && p.name.length > 1);
  const regular = unique.filter(p => p.name !== p.name.toUpperCase() || p.name.length <= 1);

  let out = '';

  if (regular.length > 0) {
    out += `### Properties (unique: ${regular.length}/${total})\n`;
    if (compact) {
      out += '| Property | Type | Platform | Description |\n';
      out += '|----------|------|----------|-------------|\n';
      for (const p of regular) {
        out += `| ${p.name} | ${typeStr(p.type)} | ${platformStr(p.platforms)} | ${truncDesc(p.summary, 50)} |\n`;
      }
    } else {
      out += '| Property | Type | Default | Platform | Description |\n';
      out += '|----------|------|---------|----------|-------------|\n';
      for (const p of regular) {
        out += `| ${p.name} | ${typeStr(p.type)} | ${p.default != null ? esc(String(p.default)) : '—'} | ${platformStr(p.platforms)} | ${truncDesc(p.summary)} |\n`;
      }
    }
    out += '\n';
  }

  if (constants.length > 0) {
    // Group constants by prefix
    const groups = {};
    for (const c of constants) {
      const prefix = c.name.split('_').slice(0, -1).join('_') || 'OTHER';
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(c.name);
    }
    out += `### Constants (${constants.length})\n`;
    for (const [prefix, names] of Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))) {
      out += `- **${prefix}_\\***: ${names.join(', ')}\n`;
    }
    out += '\n';
  }

  return out;
}

function renderMethodsTable(apiEntry, { compact = false } = {}) {
  const unique = getUniqueMembers(apiEntry, 'methods');
  if (unique.length === 0) return '';

  let out = `### Methods (${unique.length})\n`;
  out += '| Method | Returns | Platform | Description |\n';
  out += '|--------|---------|----------|-------------|\n';

  for (const m of unique) {
    const params = (m.parameters || []).map(p => p.name).join(', ');
    const returns = m.returns?.type ? typeStr(m.returns.type) : 'void';
    const descLen = compact ? 50 : 80;
    out += `| ${m.name}(${esc(params)}) | ${returns} | ${platformStr(m.platforms)} | ${truncDesc(m.summary, descLen)} |\n`;
  }
  return out;
}

function renderEventsTable(apiEntry) {
  const unique = getUniqueMembers(apiEntry, 'events');
  if (unique.length === 0) return '';

  let out = `### Events (${unique.length})\n`;
  out += '| Event | Platform | Description |\n';
  out += '|-------|----------|-------------|\n';

  for (const e of unique) {
    out += `| ${e.name} | ${platformStr(e.platforms)} | ${truncDesc(e.summary)} |\n`;
  }
  return out;
}

/** Render a compact inline pseudo type definition */
function renderPseudoInline(pseudoName) {
  const entry = apiData[pseudoName];
  if (!entry) return '';

  let out = `#### ${pseudoName}\n`;
  out += `> ${esc(entry.summary || 'Struct type')}\n\n`;

  const props = entry.properties || [];
  if (props.length === 0) return out;

  out += '| Property | Type | Description |\n';
  out += '|----------|------|-------------|\n';
  for (const p of props) {
    out += `| ${p.name} | ${typeStr(p.type)} | ${truncDesc(p.summary)} |\n`;
  }
  out += '\n';
  return out;
}

function renderApiEntry(apiName, { compact = false } = {}) {
  const entry = apiData[apiName];
  if (!entry) return `## ${apiName}\n\n> API not found in api.json\n\n---\n\n`;

  const shortName = apiName.replace(/^Titanium\./, 'Ti.');
  let out = `## ${shortName}\n`;

  // Header info
  out += `> ${esc(entry.summary || '')}\n`;
  if (entry.extends) out += `> Extends ${entry.extends.replace(/^Titanium\./, 'Ti.')}\n`;
  out += `> Platforms: ${platformStr(entry.platforms)}\n`;
  if (entry.type === 'module') out += `> Type: module\n`;
  out += '\n';

  // Overview (skip in compact mode for minor APIs)
  if (!compact) {
    const overview = getOverview(apiName);
    if (overview) {
      out += overview + '\n\n';
    }
  }

  // Properties
  out += renderPropertiesTable(entry, { compact });
  out += '\n';

  // Methods
  out += renderMethodsTable(entry, { compact });
  out += '\n';

  // Events
  out += renderEventsTable(entry);
  out += '\n';

  // Inline pseudo types (max 3 per API, skip in compact mode)
  if (!compact) {
    const pseudos = getRelatedPseudos(apiName);
    if (pseudos.length > 0) {
      const shown = pseudos.slice(0, 3);
      const remaining = pseudos.length - shown.length;
      out += '### Related Types\n\n';
      for (const pName of shown) {
        out += renderPseudoInline(pName);
      }
      if (remaining > 0) {
        out += `*Plus ${remaining} more types: ${pseudos.slice(5).join(', ')}*\n\n`;
      }
    }
  }

  out += '---\n\n';
  return out;
}

// ---------------------------------------------------------------------------
// Generate reference files
// ---------------------------------------------------------------------------
mkdirSync(path.join(OUT_DIR, 'references'), { recursive: true });

// Clean up stale reference files from previous runs
const expectedFiles = new Set(GROUP_DEFS.map(g => `${g.id}.md`));
if (existsSync(path.join(OUT_DIR, 'references'))) {
  for (const file of readdirSync(path.join(OUT_DIR, 'references'))) {
    if (file.endsWith('.md') && !expectedFiles.has(file)) {
      console.log(`Removing stale file: ${file}`);
      unlinkSync(path.join(OUT_DIR, 'references', file));
    }
  }
}

const report = [];

const LINE_LIMIT = 800;

function generateGroupContent(group, compact) {
  let content = `# ${group.title}\n\n`;
  for (const apiName of group.apis) {
    content += renderApiEntry(apiName, { compact });
  }
  // Strip dead URLs that may have come through overviews
  content = content.replace(/https?:\/\/docs\.appcelerator\.com[^\s)>]*/g, '');
  // Strip any remaining <TypeHeader/> or <ApiDocs/>
  content = content.replace(/<TypeHeader\s*\/>/g, '');
  content = content.replace(/<ApiDocs\s*\/>/g, '');
  // Replace var with const/let in code examples
  content = content.replace(/\bvar\s+(\w+)\s*=/g, 'const $1 =');
  return content;
}

for (const group of GROUP_DEFS) {
  // First pass: try full mode
  let content = generateGroupContent(group, false);
  let lineCount = content.split('\n').length;

  // Second pass: if over limit, use compact mode
  if (lineCount > LINE_LIMIT) {
    content = generateGroupContent(group, true);
    lineCount = content.split('\n').length;
  }

  const filePath = path.join(OUT_DIR, 'references', `${group.id}.md`);
  writeFileSync(filePath, content);

  const status = lineCount > LINE_LIMIT ? '⚠️  OVER 800' : '✅';
  report.push({ file: `${group.id}.md`, apis: group.apis.length, lines: lineCount, status });
}

// ---------------------------------------------------------------------------
// Generate SKILL.md
// ---------------------------------------------------------------------------
function generateSkillMd() {
  let skill = `---
name: ti-api
description: "Titanium SDK complete API reference. Use when looking up properties, methods, events, constants, or type signatures for any Ti.* or Modules.* API. Covers Ti.UI, Ti.Android, Ti.App, Ti.Media, Ti.Network, Ti.Database, Ti.Filesystem, Ti.Geolocation, Ti.Contacts, Ti.Calendar, Global, and third-party modules (Map, BLE, NFC, Facebook, Identity, CoreMotion)."
argument-hint: "[Ti.UI.Window | Ti.Network.HTTPClient | Modules.Map.View | ...]"
allowed-tools: Read, Grep, Glob
---

# Titanium API Reference

Quick lookup for properties, methods, events, and constants across all Titanium SDK and module APIs.

## How to use this skill

1. Identify which namespace the API belongs to
2. Look up the reference file in the table below
3. Read the reference file for full property/method/event tables

## Namespace Lookup

| Namespace | Reference File | Contents |
|-----------|---------------|----------|
`;

  for (const group of GROUP_DEFS) {
    // Extract primary namespace from APIs
    const namespaces = [...new Set(group.apis.map(a => {
      const parts = a.split('.');
      if (parts.length >= 3) return parts.slice(0, 3).join('.');
      return parts.slice(0, 2).join('.');
    }))];
    const nsStr = namespaces.slice(0, 4).join(', ') + (namespaces.length > 4 ? ', ...' : '');
    skill += `| ${nsStr} | [${group.id}.md](references/${group.id}.md) | ${group.title.replace(' API Reference', '')} (${group.apis.length} APIs) |\n`;
  }

  // Build a reverse lookup: API name -> group id
  const apiToGroup = {};
  for (const group of GROUP_DEFS) {
    for (const api of group.apis) {
      apiToGroup[api] = group.id;
    }
  }

  const ref = (apiName) => {
    const gid = apiToGroup[apiName];
    return gid ? `[${gid}.md](references/${gid}.md)` : '—';
  };

  skill += `
## Quick lookup by common task

| Task | API | Reference |
|------|-----|-----------|
| Create a window | Ti.UI.Window | ${ref('Titanium.UI.Window')} |
| HTTP request | Ti.Network.HTTPClient | ${ref('Titanium.Network.HTTPClient')} |
| Show an alert | Ti.UI.AlertDialog | ${ref('Titanium.UI.AlertDialog')} |
| Play audio | Ti.Media.AudioPlayer | ${ref('Titanium.Media.AudioPlayer')} |
| Read a file | Ti.Filesystem.File | ${ref('Titanium.Filesystem.File')} |
| SQLite query | Ti.Database.DB | ${ref('Titanium.Database.DB')} |
| GPS location | Ti.Geolocation | ${ref('Titanium.Geolocation')} |
| Push notification | Ti.App.iOS | ${ref('Titanium.App.iOS')} |
| ListView | Ti.UI.ListView | ${ref('Titanium.UI.ListView')} |
| Camera/gallery | Ti.Media | ${ref('Titanium.Media')} |
| Map view | Modules.Map.View | ${ref('Modules.Map.View')} |
| BLE scanning | Modules.BLE | ${ref('Modules.BLE')} |
| Animation | Ti.UI.Animation | ${ref('Titanium.UI.Animation')} |
| WebView | Ti.UI.WebView | ${ref('Titanium.UI.WebView')} |
| Contacts | Ti.Contacts | ${ref('Titanium.Contacts')} |

## Reading the reference tables

Each API entry includes:

- **Summary** — one-line description
- **Extends** — parent type (inherited properties/methods not repeated)
- **Platforms** — \`both\` (android + ios), \`android\`, or \`ios\`
- **Properties table** — unique properties (not inherited), with type, default, platform
- **Methods table** — unique methods with parameters, return type, platform
- **Events table** — unique events with platform and description
- **Related Types** — inline struct definitions used by that API

### Property counts

Tables show \`unique: X/Y\` where X is properties defined on this class and Y is total including inherited. To see inherited properties, check the parent class.

## API coverage

| Category | APIs | Reference File |
|----------|------|---------------|
`;

  for (const group of GROUP_DEFS) {
    const shortTitle = group.title.replace(' API Reference', '');
    skill += `| ${shortTitle} | ${group.apis.length} | ${group.id}.md |\n`;
  }

  skill += `
## Related skills

- **ti-ui** — UI/UX patterns, layout strategies, performance tips (narrative)
- **ti-expert** — Architecture patterns, memory management, anti-patterns
- **ti-howtos** — Integration guides for push, camera, maps, networking
- **ti-guides** — SDK fundamentals, tiapp.xml, Hyperloop
`;

  return skill;
}

const skillContent = generateSkillMd();
writeFileSync(path.join(OUT_DIR, 'SKILL.md'), skillContent);
const skillLines = skillContent.split('\n').length;

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log('\n=== ti-api Build Report ===\n');
console.log(`SKILL.md: ${skillLines} lines ${skillLines > 500 ? '⚠️  OVER 500' : '✅'}`);
console.log('');
console.log('Reference files:');
console.log('─'.repeat(60));

let totalApis = 0;
for (const r of report) {
  console.log(`  ${r.file.padEnd(35)} ${String(r.apis).padStart(3)} APIs  ${String(r.lines).padStart(5)} lines  ${r.status}`);
  totalApis += r.apis;
}

console.log('─'.repeat(60));
console.log(`  Total: ${report.length} files, ${totalApis} APIs`);

// Check for unassigned non-pseudo APIs
const assignedApis = new Set(GROUP_DEFS.flatMap(g => g.apis));
const allNonPseudo = Object.keys(apiData).filter(k => apiData[k].type !== 'pseudo');
const unassigned = allNonPseudo.filter(k => !assignedApis.has(k));
if (unassigned.length > 0) {
  console.log(`\n⚠️  ${unassigned.length} unassigned non-pseudo APIs:`);
  for (const u of unassigned) {
    console.log(`  - ${u}`);
  }
}

// Check for oversized files
const oversized = report.filter(r => r.lines > 800);
if (oversized.length > 0) {
  console.log(`\n⚠️  ${oversized.length} file(s) over 800 lines — need splitting`);
}

console.log('\nDone.');
