import { spawnSync } from 'child_process';

describe('build', () => {
  it('should use .redocly.yaml', () => {
    const r = spawnSync('node', ['../../../index.js', 'build', ' ../../../../demo/openapi.yaml'], {
      cwd: __dirname,
      shell: true,
    });

    const out = r.stdout.toString('utf-8');
    expect(out).toContain('Found .redocly.yaml and use option from features.openapi');
    expect(out).toContain('bundled successfully');
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
    expect(out).not.toContain('Found .redocly.yaml and use option from features.openapi');
    expect(out).toContain('bundled successfully');
  });
});
