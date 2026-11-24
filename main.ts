// Writes the one line to /output/entry.txt. Same bytes on every run.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'Told my agent to keep the wallet key out of the transcript. Its first command: cat wallet.json, to be sure which key to keep out.';

const dir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'entry.txt'), LINE);
