import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);

/** Four levels up from e2e/playwright/ce/docker — the derived tree only, like the other CE tests. */
export const REDOC_ROOT = fileURLToPath(new URL('../../../..', import.meta.url));

const manifest = JSON.parse(readFileSync(resolve(REDOC_ROOT, 'package.json'), 'utf8')) as {
  name: string;
};
if (manifest.name !== 'redoc') {
  throw new Error(
    `REDOC_ROOT resolved to ${REDOC_ROOT} (package "${manifest.name}"), expected the "redoc" package.`,
  );
}

export const IMAGE = 'redoc-docker-smoke';
export const SPEC_FILE = resolve(REDOC_ROOT, 'e2e/playwright/fixtures/docker-smoke.yaml');
export const MENU_PATH = ['Orders v1.2', 'List orders'];
export const HEADING = 'List orders';
const WEB_ROOT = '/usr/share/nginx/html';
const FIRST_HOST_PORT = 4200;

export type Variant = {
  name: string;
  /** Path the page is opened at; also the prefix the asset URLs must carry. */
  startPath: string;
  assetPrefix: string;
  /** Path the spec must be requested at, from the start page and from a reloaded deep link. */
  specPath: string;
  env: Record<string, string>;
  /** Extra `docker run` flags before the image name. */
  runArgs?: string[];
  /** Replaces the image's command. */
  command?: string[];
  containerPort: number;
  /** The page title as it must read in the browser (the image HTML-escapes it). */
  title: string;
};

export type StartedVariant = Variant & { container: string; baseURL: string };

const VARIANTS: Variant[] = [
  {
    // the Redoc 2.x setup: relative SPEC_URL next to the page, 2.x start command, raw title
    name: 'hash-root',
    startPath: '/',
    assetPrefix: '/',
    specPath: '/openapi.yaml',
    env: { SPEC_URL: 'openapi.yaml', PAGE_TITLE: 'Orders & "Docs" <v1>' },
    runArgs: ['-v', `${SPEC_FILE}:${WEB_ROOT}/openapi.yaml:ro`],
    command: ['sh', '/usr/local/bin/docker-run.sh'],
    containerPort: 80,
    title: 'Orders & "Docs" <v1>',
  },
  {
    // slashes around BASE_PATH are ignored; the spec lives in a directory named like the prefix
    name: 'hash-prefix',
    startPath: '/docs',
    assetPrefix: '/docs/',
    specPath: '/docs/openapi.yaml',
    env: { BASE_PATH: '/docs/', SPEC_URL: '/docs/openapi.yaml' },
    runArgs: ['-v', `${SPEC_FILE}:${WEB_ROOT}/docs/openapi.yaml:ro`],
    containerPort: 80,
    title: 'ReDoc',
  },
  {
    // locked down: read-only root filesystem, arbitrary non-root user, unprivileged port
    name: 'history-root-readonly',
    startPath: '/',
    assetPrefix: '/',
    specPath: '/openapi.yaml',
    env: { SPEC_URL: '/openapi.yaml', PORT: '8080', REDOC_OPTIONS: 'router="history"' },
    runArgs: [
      '--read-only',
      '--tmpfs',
      '/tmp',
      '--user',
      '1234:0',
      '-v',
      `${SPEC_FILE}:${WEB_ROOT}/openapi.yaml:ro`,
    ],
    containerPort: 8080,
    title: 'ReDoc',
  },
  {
    // a relative SPEC_URL with history routing resolves against the web root, not the deep link
    name: 'history-root-relative-spec',
    startPath: '/',
    assetPrefix: '/',
    specPath: '/openapi.yaml',
    env: { SPEC_URL: 'openapi.yaml', REDOC_OPTIONS: 'router="history"' },
    runArgs: ['-v', `${SPEC_FILE}:${WEB_ROOT}/openapi.yaml:ro`],
    containerPort: 80,
    title: 'ReDoc',
  },
  {
    // a colon in the query does not make a relative SPEC_URL absolute
    name: 'history-root-query-spec',
    startPath: '/',
    assetPrefix: '/',
    specPath: '/openapi.yaml',
    env: {
      SPEC_URL: 'openapi.yaml?source=https://example.com',
      REDOC_OPTIONS: 'router="history"',
    },
    runArgs: ['-v', `${SPEC_FILE}:${WEB_ROOT}/openapi.yaml:ro`],
    containerPort: 80,
    title: 'ReDoc',
  },
  {
    // a Redoc 2.x SPEC_URL that already starts with BASE_PATH does not get the prefix twice
    name: 'history-prefix-prefixed-spec',
    startPath: '/v1',
    assetPrefix: '/v1/',
    specPath: '/v1/openapi.yaml',
    env: { BASE_PATH: 'v1', SPEC_URL: 'v1/openapi.yaml', REDOC_OPTIONS: 'router="history"' },
    runArgs: ['-v', `${SPEC_FILE}:${WEB_ROOT}/openapi.yaml:ro`],
    containerPort: 80,
    title: 'ReDoc',
  },
  {
    // a nested prefix with history routing: the image passes base-path to Redoc itself
    name: 'history-nested-prefix',
    startPath: '/api/docs',
    assetPrefix: '/api/docs/',
    specPath: '/openapi.yaml',
    env: {
      BASE_PATH: 'api/docs',
      SPEC_URL: '/openapi.yaml',
      REDOC_OPTIONS: 'router="history"',
      PAGE_FAVICON: 'https://example.com/favicon.ico',
    },
    runArgs: ['-v', `${SPEC_FILE}:${WEB_ROOT}/openapi.yaml:ro`],
    containerPort: 80,
    title: 'ReDoc',
  },
];

/** Every variant, or only those named in `VARIANTS=a,b`. */
export function loadVariants(): StartedVariant[] {
  const all = VARIANTS.map((variant, index) =>
    Object.assign({}, variant, {
      container: `${IMAGE}-${variant.name}`,
      baseURL: `http://127.0.0.1:${FIRST_HOST_PORT + index}`,
    }),
  );
  const selected = process.env.VARIANTS?.split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  if (!selected?.length) return all;

  const unknown = selected.filter((name) => !all.some((variant) => variant.name === name));
  if (unknown.length) {
    throw new Error(
      `Unknown variants: ${unknown.join(', ')}. Known: ${all.map((v) => v.name).join(', ')}.`,
    );
  }
  return all.filter((variant) => selected.includes(variant.name));
}

export function hostPort(variant: StartedVariant): string {
  return new URL(variant.baseURL).port;
}

/** `docker <args>`; a failure carries docker's output. Rejects on a non-zero exit. */
export async function docker(args: string[]): Promise<{ stdout: string; stderr: string }> {
  try {
    return await exec('docker', args, { maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string; message: string };
    throw new Error(
      `docker ${args[0]} failed\n${failure.stdout ?? ''}${failure.stderr ?? failure.message}`,
    );
  }
}
