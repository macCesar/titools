/**
 * Tests for lib/utils.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  parseVersion,
  compareVersions,
  formatList,
} from '../lib/utils.js';

describe('utils', () => {
  describe('parseVersion', () => {
    it('should parse standard version', () => {
      const result = parseVersion('13.1.0');
      assert.deepStrictEqual(result, [13, 1, 0]);
    });

    it('should parse version with GA suffix', () => {
      const result = parseVersion('13.1.0.GA');
      assert.deepStrictEqual(result, [13, 1, 0]);
    });

    it('should parse version with RC suffix', () => {
      const result = parseVersion('13.1.0.RC');
      assert.deepStrictEqual(result, [13, 1, 0]);
    });

    it('should handle beta versions', () => {
      const result = parseVersion('13.0.0-beta');
      assert.deepStrictEqual(result, [13, 0, 0]);
    });
  });

  describe('compareVersions', () => {
    it('should return 0 for equal versions', () => {
      assert.strictEqual(compareVersions('13.1.0', '13.1.0'), 0);
      assert.strictEqual(compareVersions('13.1.0.GA', '13.1.0'), 0);
    });

    it('should return -1 when first is lower', () => {
      assert.strictEqual(compareVersions('13.0.0', '13.1.0'), -1);
      assert.strictEqual(compareVersions('12.1.0', '13.1.0'), -1);
    });

    it('should return 1 when first is higher', () => {
      assert.strictEqual(compareVersions('13.1.0', '13.0.0'), 1);
      assert.strictEqual(compareVersions('14.0.0', '13.1.0'), 1);
    });

    it('should handle different length versions', () => {
      assert.strictEqual(compareVersions('13.0', '13.0.0'), 0);
      assert.strictEqual(compareVersions('13.0.0', '13.0.1'), -1);
    });
  });

  describe('formatList', () => {
    it('should format empty array', () => {
      assert.strictEqual(formatList([]), '');
    });

    it('should format single item', () => {
      assert.strictEqual(formatList(['one']), 'one');
    });

    it('should format multiple items', () => {
      assert.strictEqual(formatList(['one', 'two', 'three']), 'one, two, three');
    });
  });
});
