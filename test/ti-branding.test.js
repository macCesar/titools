import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { access, constants, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const skillDir = join(repoRoot, 'skills', 'ti-branding');
const entryScript = join(skillDir, 'scripts', 'ti-branding');

function run(cmd, args, { cwd } = {}) {
  return new Promise((resolvePromise) => {
    execFile(cmd, args, { cwd, timeout: 15000 }, (error, stdout, stderr) => {
      resolvePromise({
        code: error?.code ?? 0,
        stdout: stdout?.toString() ?? '',
        stderr: stderr?.toString() ?? '',
      });
    });
  });
}

describe('ti-branding skill', () => {
  describe('package layout', () => {
    it('SKILL.md exists and has required frontmatter', async () => {
      const src = await readFile(join(skillDir, 'SKILL.md'), 'utf8');
      assert.match(src, /^---/m, 'file should start with frontmatter');
      assert.match(src, /name:\s*ti-branding/);
      assert.match(src, /description:/);
      assert.match(src, /argument-hint:/);
      assert.match(src, /allowed-tools:/);
    });

    it('entry script is executable', async () => {
      const info = await stat(entryScript);
      const mode = info.mode & 0o111;
      assert.ok(mode !== 0, 'entry script should have execute bit set');
    });

    it('all required lib scripts are present', async () => {
      const required = [
        'deps.sh',
        'validate.sh',
        'prepare-master.sh',
        'gen-ios.sh',
        'gen-android-adaptive.sh',
        'gen-android-legacy.sh',
        'gen-notification.sh',
        'gen-splash-icon.sh',
        'gen-marketplace.sh',
        'cleanup-legacy.sh',
      ];
      for (const name of required) {
        await access(join(skillDir, 'scripts', 'lib', name), constants.R_OK);
      }
    });

    it('adaptive icon XML asset is present', async () => {
      const xml = await readFile(join(skillDir, 'assets', 'ic_launcher.xml'), 'utf8');
      assert.match(xml, /<adaptive-icon/);
      assert.match(xml, /ic_launcher_foreground/);
      assert.match(xml, /ic_launcher_background/);
      assert.match(xml, /ic_launcher_monochrome/);
    });

    it('reference docs are present', async () => {
      const refs = [
        'ti-icon-paths.md',
        'android-adaptive-icons.md',
        'ios-appiconset.md',
        'notification-icons.md',
        'splash-screen-api.md',
        'master-input-guidelines.md',
        'tiapp-xml-snippets.md',
      ];
      for (const name of refs) {
        await access(join(skillDir, 'references', name), constants.R_OK);
      }
    });
  });

  describe('CLI behavior', () => {
    it('shows help with --help', async () => {
      const result = await run('bash', [entryScript, '--help']);
      assert.equal(result.code, 0);
      assert.match(result.stdout, /ti-branding/);
      assert.match(result.stdout, /--bg-color/);
      assert.match(result.stdout, /--padding/);
      assert.match(result.stdout, /--with-notification/);
      assert.match(result.stdout, /--with-splash-icon/);
      assert.match(result.stdout, /--cleanup-legacy/);
      assert.match(result.stdout, /--aggressive/);
    });

    it('accepts --cleanup-legacy without master image (cleanup-only mode)', async () => {
      const result = await run('bash', [entryScript, '--cleanup-legacy', '--dry-run']);
      assert.equal(result.code, 0, `expected success, got stderr: ${result.stderr}`);
      assert.match(result.stdout, /Cleanup plan|Cleanup-only mode/);
    });

    it('errors when master path is missing', async () => {
      const result = await run('bash', [entryScript]);
      assert.notEqual(result.code, 0);
      assert.match(result.stderr + result.stdout, /Master image path is required|required/i);
    });

    it('errors on non-existent master', async () => {
      const result = await run('bash', [entryScript, '/tmp/__definitely_missing__.png']);
      assert.notEqual(result.code, 0);
      assert.match(result.stderr + result.stdout, /not found|No such file/i);
    });

    it('rejects padding out of range', async () => {
      const result = await run('bash', [entryScript, entryScript, '--padding', '99']);
      assert.notEqual(result.code, 0);
      assert.match(result.stderr + result.stdout, /Padding must be between/);
    });

    it('rejects malformed bg-color', async () => {
      const result = await run('bash', [entryScript, entryScript, '--bg-color', 'notacolor']);
      assert.notEqual(result.code, 0);
      assert.match(result.stderr + result.stdout, /6-digit hex/);
    });
  });

  describe('shell syntax', () => {
    it('entry script parses as valid bash', async () => {
      const result = await run('bash', ['-n', entryScript]);
      assert.equal(result.code, 0, `syntax error: ${result.stderr}`);
    });

    it('all lib scripts parse as valid bash', async () => {
      const libs = [
        'deps.sh',
        'validate.sh',
        'prepare-master.sh',
        'gen-ios.sh',
        'gen-android-adaptive.sh',
        'gen-android-legacy.sh',
        'gen-notification.sh',
        'gen-splash-icon.sh',
        'gen-marketplace.sh',
      ];
      for (const lib of libs) {
        const result = await run('bash', ['-n', join(skillDir, 'scripts', 'lib', lib)]);
        assert.equal(result.code, 0, `syntax error in ${lib}: ${result.stderr}`);
      }
    });
  });
});
