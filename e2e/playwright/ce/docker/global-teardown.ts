import { docker, loadVariants } from './variants.js';

export default async function globalTeardown(): Promise<void> {
  for (const variant of loadVariants()) {
    await docker(['rm', '-f', variant.container]).catch(() => undefined);
  }
}
