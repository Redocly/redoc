import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';

describe('build', () => {
  it('should use .redocly.yaml', () => {
    const r = spawnSync(
      'ts-node',
      ['../../../index.ts', 'build', ' ../../../../demo/openapi.yaml', '--output=redoc-test.html'],
      {
        cwd: __dirname,
        shell: true,
      },
    );

    const out = r.stdout.toString('utf-8');
    const err = r.stderr.toString('utf-8');
    const result = `${out}\n${err}`;

    try {
      const redocStaticFile = readFileSync(`${__dirname}/redoc-test.html`, 'utf8');
      expect(redocStaticFile).toContain('"options":{"disableSearch":true}');
      expect(redocStaticFile).not.toContain('data-role="redoc-search"');
    } catch (err) {
      expect(err.toString()).toContain('{"options":{"disableSearch":"true"}');
    }

    expect(result).toContain('Found .redocly.yaml and using features.openapi options');
    expect(result).toContain('bundled successfully');
  });

  it('should ingest version data from json file', () => {
    const pathToTestData = '__test__/data/version-data.json';
    const r = spawnSync(
      'ts-node',
      [
        '../../../index.ts',
        'build',
        ' ../../../../demo/openapi.yaml',
        '--output=redoc-test.html',
        `--options.versionData=${pathToTestData}`,
      ],
      {
        cwd: __dirname,
        shell: true,
      },
    );

    const out = r.stdout.toString('utf-8');
    const err = r.stderr.toString('utf-8');
    const result = `${out}\n${err}`;

    expect(result).toContain(`Found ${pathToTestData} and using version data.`);
    expect(result).toContain('bundled successfully');
  });
});
