import { describe, it, expect } from 'vitest';

import { convertSwagger2OpenAPI } from '../index.js';

describe('convertSwagger2OpenAPI', () => {
  it('rejects a document whose version it cannot convert', async () => {
    await expect(convertSwagger2OpenAPI({ swagger: '1.2', info: {}, paths: {} })).rejects.toThrow(
      'Unsupported swagger/OpenAPI version: 1.2',
    );
  });

  it('rejects a Swagger 2.0 document whose info is not an object', async () => {
    await expect(
      convertSwagger2OpenAPI({ swagger: '2.0', info: 'Pets', paths: {} }),
    ).rejects.toThrow('info must be an object');
  });

  it('adds an empty paths object when the document has none', async () => {
    const result = await convertSwagger2OpenAPI({
      swagger: '2.0',
      info: { title: 'Pets', version: '1.0.0' },
    });

    expect(result.paths).toEqual({});
  });

  it('leaves the input document unchanged', async () => {
    const input = { swagger: '2.0', info: { title: 'Pets', version: '1.0.0' } };

    await convertSwagger2OpenAPI(input);

    expect(input).toEqual({ swagger: '2.0', info: { title: 'Pets', version: '1.0.0' } });
  });
});
