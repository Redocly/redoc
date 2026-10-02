import { execFile } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { promisify } from 'node:util';

import { BUNDLE_DIR, BUNDLE_URL, REDOC_ROOT, loadExamples } from './manifests.js';

import type { Example } from './manifests.js';

const exec = promisify(execFile);
const START_TIMEOUT_MS = 90_000;

/** Packs the local build, builds and starts every selected example's container. */
export default async function globalSetup(): Promise<void> {
  assertBundleBuilt();
  const examples = loadExamples();
  const tarball = await packRedoc();
  try {
    await Promise.all(examples.map((example) => build(example, tarball)));
  } finally {
    rmSync(dirname(tarball), { recursive: true, force: true });
  }
  await Promise.all(examples.map(start));
  await Promise.all(examples.map(waitUntilServing));
}

function assertBundleBuilt(): void {
  for (const file of [`${BUNDLE_DIR}/redoc.js`, `${BUNDLE_DIR}/redoc.standalone.js`]) {
    if (!existsSync(resolve(REDOC_ROOT, file))) {
      throw new Error(`Missing ${file} — run \`npm run build\` first.`);
    }
  }
}

async function packRedoc(): Promise<string> {
  const destination = mkdtempSync(resolve(tmpdir(), 'redoc-examples-'));
  const { stdout } = await exec('npm', ['pack', '--json', '--pack-destination', destination], {
    cwd: REDOC_ROOT,
  });
  const [{ filename }] = JSON.parse(stdout) as { filename: string }[];
  return resolve(destination, filename);
}

async function build(example: Example, tarball: string): Promise<void> {
  if (example.usesNpm) copyFileSync(tarball, resolve(example.dir, 'redoc.tgz'));
  log(example, 'docker build');
  await docker(example, ['build', '-f', dockerfile(example), '-t', example.image, example.dir]);
  if (example.usesNpm) await assertInstalledFromTarball(example);
}

/**
 * The image must have installed `redoc` from the tarball, not from npm; otherwise the smoke
 * would pass against the published package no matter what this checkout contains.
 */
async function assertInstalledFromTarball(example: Example): Promise<void> {
  const buildImage = `${example.image}-build`;
  await docker(example, [
    'build',
    '-f',
    dockerfile(example),
    '--target',
    'build',
    '-t',
    buildImage,
    example.dir,
  ]);
  const { stdout } = await docker(example, [
    'run',
    '--rm',
    '--entrypoint',
    'npm',
    buildImage,
    'ls',
    'redoc',
    '--json',
  ]);
  const resolved: string =
    (JSON.parse(stdout) as { dependencies?: Record<string, { resolved?: string }> }).dependencies
      ?.redoc?.resolved ?? '';
  if (!resolved.startsWith('file:')) {
    throw new Error(
      `${example.name}: the image installed redoc from "${resolved || 'an unknown source'}" ` +
        'instead of the local tarball. Its docker/Dockerfile must install ./redoc.tgz when present ' +
        '(see examples/README.md).',
    );
  }
}

/** The port the image listens on: `EXPOSE` in the Dockerfile, or inherited from the base image. */
async function exposedPort(example: Example): Promise<number> {
  const { stdout } = await docker(example, [
    'image',
    'inspect',
    '--format',
    '{{json .Config.ExposedPorts}}',
    example.image,
  ]);
  const ports = Object.keys((JSON.parse(stdout) as Record<string, unknown> | null) ?? {});
  if (ports.length !== 1) {
    throw new Error(
      `${example.name}: the image must expose exactly one port, found ${ports.join(', ') || 'none'}.`,
    );
  }
  return Number(ports[0].split('/')[0]);
}

async function start(example: Example): Promise<void> {
  const port = await exposedPort(example);
  await docker(example, ['rm', '-f', example.container]).catch(() => undefined);
  log(example, `docker run → ${example.baseURL}`);
  await docker(example, [
    'run',
    '-d',
    '--name',
    example.container,
    '-p',
    `127.0.0.1:${example.hostPort}:${port}`,
    '-e',
    `REDOC_URL=${BUNDLE_URL}`,
    example.image,
  ]);
}

async function waitUntilServing(example: Example): Promise<void> {
  const url = `${example.baseURL}/`;
  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const ok = await fetch(url)
      .then((response) => response.ok)
      .catch(() => false);
    if (ok) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  const logs = await exec('docker', ['logs', '--tail', '40', example.container]).catch(() => ({
    stdout: '',
    stderr: '',
  }));
  throw new Error(
    `${example.name}: ${url} did not answer within ${START_TIMEOUT_MS / 1000}s.\n` +
      `${logs.stdout}${logs.stderr}`,
  );
}

async function docker(
  example: Example,
  args: string[],
): Promise<{ stdout: string; stderr: string }> {
  try {
    return await exec('docker', args, { maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string; message: string };
    throw new Error(
      `${example.name}: docker ${args[0]} failed\n${failure.stdout ?? ''}${failure.stderr ?? failure.message}`,
    );
  }
}

function dockerfile(example: Example): string {
  return resolve(example.dir, 'docker/Dockerfile');
}

function log(example: Example, message: string): void {
  process.stdout.write(`[${example.name}] ${message}\n`);
}
