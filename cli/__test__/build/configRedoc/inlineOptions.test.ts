import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';

describe('build with inline options', () => {
  it('should use inline options and ignore .redocly.yaml', () => {
    const r = spawnSync(
      'ts-node',
      [
        '../../../index.ts',
        'build',
        ' ../../../../demo/openapi.yaml',
        '--options.disableSearch="false" ',
      ],
      {
        cwd: __dirname,
        shell: true,
      },
    );

    const out = r.stdout.toString('utf-8');
    const err = r.stderr.toString('utf-8');
    const result = `${out}\n${err}`;
    expect(result).not.toContain('Found .redocly.yaml and using features.openapi options');
    expect(result).toContain('bundled successfully');

    try {
      const redocStaticFile = readFileSync(`${__dirname}/redoc-static.html`, 'utf8');
      expect(redocStaticFile).toContain('"options":{"disableSearch":"false"}');
      expect(redocStaticFile).toContain('role="search"');
    } catch (err) {
      expect(err.toString()).toContain('"options":{"disableSearch":"false"}');
    }
  });
});
