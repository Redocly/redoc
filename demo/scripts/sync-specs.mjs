import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../playground/specs');
const dest = resolve(here, '../public/specs');

if (!existsSync(src)) {
  console.error(
    `${src} not found - the demo copies its specs from playground/specs at the repo root`,
  );
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log(`Synced demo specs: ${src} -> ${dest}`);
