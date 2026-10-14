import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Four levels up from e2e/playwright/ce/examples — the derived tree only, like the other CE tests. */
export const REDOC_ROOT = fileURLToPath(new URL('../../../..', import.meta.url));
const EXAMPLES_DIR = resolve(REDOC_ROOT, 'examples');

/** Build output dir under REDOC_ROOT; the harness serves it here and CDN-based examples load the local build from it. */
export const BUNDLE_DIR = 'bundles';
export const BUNDLE_PORT = 4099;
export const BUNDLE_URL = `http://127.0.0.1:${BUNDLE_PORT}/redoc.standalone.js`;
const FIRST_HOST_PORT = 4100;

// An off-by-one would silently walk a sibling package; the same guard prepare-host uses.
const manifest = JSON.parse(readFileSync(resolve(REDOC_ROOT, 'package.json'), 'utf8')) as {
  name: string;
};
if (manifest.name !== 'redoc') {
  throw new Error(
    `REDOC_ROOT resolved to ${REDOC_ROOT} (package "${manifest.name}"), expected the "redoc" package.`,
  );
}

export type Example = {
  name: string;
  dir: string;
  /** Depends on the `redoc` npm package (tested from the packed tarball); otherwise it loads the bundle from a CDN. */
  usesNpm: boolean;
  /** Host port the harness publishes it on — stable per example, clear of common dev ports. */
  hostPort: number;
  image: string;
  container: string;
  baseURL: string;
};

/** Every directory with a docker/Dockerfile, sorted by name, or only those named in `EXAMPLES=a,b`. */
export function loadExamples(): Example[] {
  const all = readdirSync(EXAMPLES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(resolve(EXAMPLES_DIR, name, 'docker/Dockerfile')))
    .sort()
    .map((name, index) => {
      const dir = resolve(EXAMPLES_DIR, name);
      const hostPort = FIRST_HOST_PORT + index;
      return {
        name,
        dir,
        usesNpm: dependsOnRedoc(dir),
        hostPort,
        image: `redoc-example-${name}`,
        container: `redoc-example-${name}`,
        baseURL: `http://127.0.0.1:${hostPort}`,
      };
    });

  const selected = process.env.EXAMPLES?.split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  if (!selected?.length) return all;

  const known = all.map((example) => example.name);
  const unknown = selected.filter((name) => !known.includes(name));
  if (unknown.length) {
    throw new Error(`Unknown examples: ${unknown.join(', ')}. Known: ${known.join(', ')}.`);
  }
  return all.filter((example) => selected.includes(example.name));
}

function dependsOnRedoc(dir: string): boolean {
  const packageJsonPath = resolve(dir, 'package.json');
  if (!existsSync(packageJsonPath)) return false;
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    dependencies?: Record<string, string>;
  };
  return Boolean(packageJson.dependencies?.redoc);
}
