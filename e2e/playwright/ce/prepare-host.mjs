#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Stages `bundles/` and `specs/` into this directory, which the `bundles` project serves
 * statically. Must run after every source-preparation step, which deletes the enclosing tree.
 */
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
/** Three levels up — the sibling files in `tests/` and `react-host/` need four. */
const REDOC_ROOT = resolve(HERE, '../../..');

// An off-by-one silently stages a sibling package's build here, surfacing as mass 404 timeouts.
const manifest = JSON.parse(readFileSync(resolve(REDOC_ROOT, 'package.json'), 'utf8'));
if (manifest.name !== 'redoc') {
  throw new Error(
    `REDOC_ROOT resolved to ${REDOC_ROOT} (package "${manifest.name}"), expected the "redoc" package.`,
  );
}

const rel = (p) => p.replace(`${REDOC_ROOT}/`, '');

function replaceDir(from, to) {
  if (!existsSync(from)) {
    throw new Error(
      `Missing ${rel(from)}. Run \`npm run e2e:build\` first (and, in the monorepo, ` +
        `the repository's source-preparation step).`,
    );
  }
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  console.log(`  ${rel(from)} -> ${rel(to)}`);
}

replaceDir(resolve(REDOC_ROOT, 'bundles'), resolve(HERE, 'bundles'));
replaceDir(resolve(REDOC_ROOT, 'playground/specs'), resolve(HERE, 'specs'));
