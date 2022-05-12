import { spawnSync } from 'child_process';

describe('build with url', () => {
  // FIXME: remove skip after release
  it.skip('should not fail on resolving url', () => {
    const r = spawnSync(
      'ts-node',
      [
        '../../../index.js',
        'build',
        'http://petstore.swagger.io/v2/swagger.json',
        '--output=url-test.html',
      ],
      {
        cwd: __dirname,
        shell: true,
      },
    );

    const out = r.stdout.toString('utf-8');
    const err = r.stderr.toString('utf-8');
    const result = `${out}\n${err}`;
    expect(result).toContain('bundled successfully');
  });
});
