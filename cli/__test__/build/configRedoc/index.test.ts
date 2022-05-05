import { spawnSync } from 'child_process';

describe('build', () => {
  it('should use .redocly.yaml', () => {
    const r = spawnSync('node', ['../../../index.js', 'build', ' ../../../../demo/openapi.yaml'], {
      cwd: __dirname,
      shell: true,
    });

    const out = r.stdout.toString('utf-8');
    const err = r.stderr.toString('utf-8');
    const result = `${out}\n${err}`;
    expect(result).toContain('Found .redocly.yaml and use option from features.openapi');
    expect(result).toContain('bundled successfully');
  });

  it('should use inline options and ignore .redocly.yaml', () => {
    const r = spawnSync(
      'node',
      [
        '../../../index.js',
        'build',
        ' ../../../../demo/openapi.yaml',
        '--options.disableSearch=true',
      ],
      {
        cwd: __dirname,
        shell: true,
      },
    );

    const out = r.stdout.toString('utf-8');
    const err = r.stderr.toString('utf-8');
    const result = `${out}\n${err}`;
    expect(result).not.toContain('Found .redocly.yaml and use option from features.openapi');
    expect(result).toContain('bundled successfully');
  });
});
