import { execFile } from 'node:child_process';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

import { loadExamples } from './manifests.js';

const exec = promisify(execFile);

export default async function globalTeardown(): Promise<void> {
  for (const example of loadExamples()) {
    await exec('docker', ['rm', '-f', example.container]).catch(() => undefined);
    rmSync(resolve(example.dir, 'redoc.tgz'), { force: true });
  }
}
