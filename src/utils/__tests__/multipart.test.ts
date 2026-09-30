import { describe, expect, it } from 'vitest';

import { parseMultipartFormData } from '../multipart.js';

describe('parseMultipartFormData', () => {
  it('parses a serialized multipart body into per-field text and file parts', () => {
    const body = [
      '----formdata',
      'Content-Disposition: form-data; name="name"',
      '',
      'Museum Visitor',
      '----formdata',
      'Content-Disposition: form-data; name="file"; filename="document.pdf"',
      'Content-Type: application/pdf',
      '',
      '<binary content of document.pdf>',
      '----formdata--',
      '',
    ].join('\n');

    expect(parseMultipartFormData(body)).toEqual([
      { name: 'name', value: 'Museum Visitor' },
      { name: 'file', fileName: 'document.pdf', contentType: 'application/pdf' },
    ]);
  });

  it('returns undefined for strings that do not start with a boundary delimiter', () => {
    expect(parseMultipartFormData('hello world')).toBeUndefined();
    expect(parseMultipartFormData('')).toBeUndefined();
  });

  it('returns undefined when no parts can be extracted', () => {
    expect(parseMultipartFormData('--BOUNDARY\r\n--BOUNDARY--')).toBeUndefined();
  });
});
