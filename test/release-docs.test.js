/**
 * Release-docs consistency tests.
 *
 * How this repo publishes is a fact with one source of truth — `.github/workflows/`
 * — and five hand-written copies: the checklist in CLAUDE.md, the checklist in
 * AGENTS.md, and the notes under docs/project/. Prose has no way of noticing when
 * the workflow changes underneath it.
 *
 * It already happened. Trusted publishing (OIDC) landed on 2026-08-14 in dc4c527,
 * and for a week afterwards CLAUDE.md still listed `npm publish --access public`
 * as step 8 of the release and AGENTS.md still explained how to pass an `--otp`.
 * Both were wrong, both read as authoritative, and nothing failed.
 *
 * So these tests do not assert what the docs say. They *derive* how publishing
 * works from the workflow files and then require the docs to agree:
 *
 *   - the workflow publishes on a tag  → no doc may order a manual `npm publish`,
 *                                        and every doc must name the workflow
 *   - no workflow publishes at all     → some doc had better order it by hand,
 *                                        or nobody is publishing anything
 *
 * That second branch is the point. A test that only knows today's answer is not an
 * instrument, it is a snapshot: deleting publish.yml would leave it green while the
 * release silently stopped shipping. The derivation helpers below are themselves
 * checked against synthetic inputs, both the case they must accept and the case
 * they must reject, so a helper that always answers the same thing fails here
 * rather than in a release.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');

/** Docs that carry a release checklist a human or an agent follows. */
const DOC_FILES = ['CLAUDE.md', 'AGENTS.md'];

/**
 * Does this workflow publish to npm when a version tag is pushed?
 *
 * Deliberately not a YAML parser: the question is narrow enough that matching the
 * two shapes GitHub Actions accepts for a tag trigger is cheaper and clearer than
 * a dependency. Both a block list and an inline list count.
 */
export const publishesOnTag = (src) => {
  const blockList = /^[ \t]*tags:[ \t]*\r?\n[ \t]*-[ \t]*['"]?v/m.test(src);
  const inlineList = /^[ \t]*tags:[ \t]*\[[ \t]*['"]?v/m.test(src);
  return (blockList || inlineList) && /npm publish/.test(src);
};

/**
 * Lines of a doc that order someone to publish by hand — a numbered checklist step
 * mentioning `npm publish`. Prose *about* publishing ("step 8 used to be a manual
 * npm publish") is not an order and must not match, or the docs could never
 * describe the history that made this file necessary.
 */
export const manualPublishSteps = (doc) =>
  doc
    .split('\n')
    .filter((line) => /^[ \t]*\d+\.[ \t]/.test(line) && /npm publish/.test(line));

const listWorkflows = () =>
  existsSync(WORKFLOWS_DIR)
    ? readdirSync(WORKFLOWS_DIR)
        .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))
        .map((file) => ({ file, src: readFileSync(path.join(WORKFLOWS_DIR, file), 'utf8') }))
    : [];

const readDoc = (file) => {
  const full = path.join(ROOT, file);
  return existsSync(full) ? readFileSync(full, 'utf8') : null;
};

const workflows = listWorkflows();
const publishing = workflows.filter(({ src }) => publishesOnTag(src));

describe('release docs: the derivation helpers can tell the cases apart', () => {
  const TAG_PUBLISH = ['on:', '  push:', '    tags:', "      - 'v*'", 'jobs:', '  publish:', '    steps:', '      - run: npm publish'].join('\n');
  const TAG_INLINE = ['on:', '  push:', "    tags: ['v*']", 'jobs:', '  publish:', '    steps:', '      - run: npm publish'].join('\n');
  const TAG_NO_PUBLISH = ['on:', '  push:', '    tags:', "      - 'v*'", 'jobs:', '  test:', '    steps:', '      - run: npm test'].join('\n');
  const PUBLISH_NO_TAG = ['on:', '  workflow_dispatch:', 'jobs:', '  publish:', '    steps:', '      - run: npm publish'].join('\n');

  test('publishesOnTag accepts a tag-triggered publish, block or inline list', () => {
    assert.equal(publishesOnTag(TAG_PUBLISH), true);
    assert.equal(publishesOnTag(TAG_INLINE), true);
  });

  test('publishesOnTag rejects a tag workflow that does not publish', () => {
    assert.equal(publishesOnTag(TAG_NO_PUBLISH), false);
  });

  test('publishesOnTag rejects a publish that no tag triggers', () => {
    assert.equal(publishesOnTag(PUBLISH_NO_TAG), false);
  });

  test('manualPublishSteps flags a checklist step that orders a publish', () => {
    const doc = ['7. Push `main` + push the tag.', '8. `npm publish --access public`.'].join('\n');
    assert.deepEqual(manualPublishSteps(doc), ['8. `npm publish --access public`.']);
  });

  test('manualPublishSteps ignores prose about publishing', () => {
    const doc = [
      'Step 8 used to be a manual `npm publish --access public`, and it was skipped once.',
      '- **Marketplace channel** — **`npm publish` does nothing here.**',
    ].join('\n');
    assert.deepEqual(manualPublishSteps(doc), []);
  });
});

describe('release docs match how the repo actually publishes', () => {
  test('the publishing mechanism is discoverable from .github/workflows', () => {
    assert.ok(
      workflows.length > 0,
      'No workflows found. If CI was removed on purpose, this suite still holds — but the docs must then describe a manual publish.'
    );
  });

  if (publishing.length > 0) {
    const names = publishing.map(({ file }) => file);

    for (const file of DOC_FILES) {
      test(`${file} does not order a manual npm publish`, () => {
        const doc = readDoc(file);
        if (doc === null) {
          return; // a doc this repo does not ship is not a failure here
        }
        assert.deepEqual(
          manualPublishSteps(doc),
          [],
          `${file} still lists a manual \`npm publish\` step, but ${names.join(', ')} publishes on the tag. ` +
            'One of the two is wrong — and the workflow is the one that runs.'
        );
      });

      test(`${file} names the workflow that does the publishing`, () => {
        const doc = readDoc(file);
        if (doc === null) {
          return;
        }
        assert.ok(
          names.some((name) => doc.includes(name)),
          `${file} describes the release without naming ${names.join(' / ')}. ` +
            'A reader who wants to know what publishing actually does has nowhere to look.'
        );
      });
    }

    test('the publishing workflow guards both version files, as the docs claim', () => {
      for (const { file, src } of publishing) {
        assert.ok(
          src.includes('package.json') && src.includes('plugin.json'),
          `${file} publishes on a tag without checking it against both package.json and plugin.json. ` +
            'The release checklist promises that guard — either restore it or stop promising it.'
        );
      }
    });
  } else {
    test('a doc still tells someone to publish by hand', () => {
      const orders = DOC_FILES.map(readDoc)
        .filter((doc) => doc !== null)
        .flatMap(manualPublishSteps);
      assert.ok(
        orders.length > 0,
        'No workflow publishes on a tag and no doc orders a manual `npm publish`. ' +
          'As written, a release reaches the marketplace and never reaches npm.'
      );
    });
  }
});
