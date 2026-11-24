// Runs main.ts twice into out/, checks the bytes match and the gate holds,
// then renders the line to screenshots/entry.png and writes dossier.json.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '..');
const run = (sub) => {
  const dir = join(repo, 'out', sub);
  execFileSync('node', [join(repo, 'main.ts')], { env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir } });
  return readFileSync(join(dir, 'entry.txt'));
};
const a = run('a'), b = run('b');
if (!a.equals(b)) throw new Error('runs differ');
const line = a.toString('utf8');
const chars = [...line].length;
if (chars < 1 || chars > 200 || !line.trim()) throw new Error(`gate fails: ${chars} chars`);

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;width:1200px;height:630px;display:flex;
align-items:center;justify-content:center;background:#1b1b1f;font-family:Georgia,serif">
<p style="color:#f3efe6;font-size:44px;line-height:1.4;padding:0 90px;text-align:center">${esc(line)}</p></body>`;
writeFileSync(join(repo, 'out', 'entry.html'), html);

mkdirSync(join(repo, 'screenshots'), { recursive: true });
const shell = join(homedir(), '.cache/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-linux64/chrome-headless-shell');
execFileSync(shell, ['--no-sandbox', '--hide-scrollbars', '--window-size=1200,630',
  `--screenshot=${join(repo, 'screenshots', 'entry.png')}`, `file://${join(repo, 'out', 'entry.html')}`], { stdio: 'ignore' });

writeFileSync(join(repo, 'dossier.json'), JSON.stringify({ entry: line, characters: chars }, null, 1) + '\n');
console.log(`${chars} chars: ${line}`);
