import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { IMAGE, REDOC_ROOT, docker, hostPort, loadVariants } from './variants.js';

import type { StartedVariant } from './variants.js';

const BUNDLE = 'bundles/redoc.standalone.js';
const START_TIMEOUT_MS = 60_000;

/** Builds the image around the local bundle and starts one container per variant. */
export default async function globalSetup(): Promise<void> {
  if (!existsSync(resolve(REDOC_ROOT, BUNDLE))) {
    throw new Error(`Missing ${BUNDLE} — run \`npm run build\` first.`);
  }
  process.stdout.write(`[docker] build ${IMAGE}\n`);
  await docker([
    'build',
    '--build-arg',
    'BUNDLE_STAGE=prebuilt',
    '-f',
    resolve(REDOC_ROOT, 'config/docker/Dockerfile'),
    '-t',
    IMAGE,
    REDOC_ROOT,
  ]);
  const variants = loadVariants();
  await Promise.all(variants.map(start));
  await Promise.all(variants.map(waitUntilServing));
}

async function start(variant: StartedVariant): Promise<void> {
  await docker(['rm', '-f', variant.container]).catch(() => undefined);
  process.stdout.write(`[${variant.name}] docker run → ${variant.baseURL}${variant.startPath}\n`);
  await docker([
    'run',
    '-d',
    '--name',
    variant.container,
    '-p',
    `127.0.0.1:${hostPort(variant)}:${variant.containerPort}`,
    ...Object.entries(variant.env).flatMap(([name, value]) => ['-e', `${name}=${value}`]),
    ...(variant.runArgs ?? []),
    IMAGE,
    ...(variant.command ?? []),
  ]);
}

async function waitUntilServing(variant: StartedVariant): Promise<void> {
  const url = `${variant.baseURL}${variant.startPath}`;
  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const ok = await fetch(url)
      .then((response) => response.ok)
      .catch(() => false);
    if (ok) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  const logs = await docker(['logs', '--tail', '40', variant.container]).catch(() => ({
    stdout: '',
    stderr: '',
  }));
  throw new Error(
    `${variant.name}: ${url} did not answer within ${START_TIMEOUT_MS / 1000}s.\n` +
      `${logs.stdout}${logs.stderr}`,
  );
}
