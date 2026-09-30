import { describe, it, expect } from 'vitest';

import { MediaTypes } from '../../../constants/openapi.js';
import { convertSampleToString } from '../convertSampleToString.js';

describe('convertSampleToString', () => {
  describe('EVENT_STREAM', () => {
    it('should convert objects to SSE format', () => {
      const obj = {
        event: 'message',
        data: 'Hello World',
        id: '123',
        retry: 3000,
      };
      const result = convertSampleToString(obj, MediaTypes.EVENT_STREAM);
      expect(result).toBe('event: message\ndata: Hello World\nid: 123\nretry: 3000');
    });

    it('should convert object with only data field', () => {
      const obj = { data: 'test data' };
      const result = convertSampleToString(obj, MediaTypes.EVENT_STREAM);
      expect(result).toBe('data: test data');
    });

    it('should handle multi-line data', () => {
      const obj = { data: 'line1\nline2\nline3' };
      const result = convertSampleToString(obj, MediaTypes.EVENT_STREAM);
      expect(result).toBe('data: line1\ndata: line2\ndata: line3');
    });

    it('should convert object data as JSON', () => {
      const obj = { data: { key: 'value', number: 123 } };
      const result = convertSampleToString(obj, MediaTypes.EVENT_STREAM);
      expect(result).toBe('data: {"key":"value","number":123}');
    });

    it('should not convert non-object values', () => {
      expect(convertSampleToString('string', MediaTypes.EVENT_STREAM)).toBe('string');
      expect(convertSampleToString(42, MediaTypes.EVENT_STREAM)).toBe(42);
      expect(convertSampleToString(null, MediaTypes.EVENT_STREAM)).toBe(null);
    });
  });

  describe('JSONL', () => {
    it('should convert objects to JSON lines', () => {
      const obj = { name: 'test', value: 123 };
      const result = convertSampleToString(obj, MediaTypes.JSONL);
      expect(result).toBe('{"name":"test","value":123}');
    });
  });

  describe('NDJSON', () => {
    it('should convert objects to JSON lines', () => {
      const obj = { name: 'test', value: 123 };
      const result = convertSampleToString(obj, MediaTypes.NDJSON);
      expect(result).toBe('{"name":"test","value":123}');
    });
  });

  describe('JSON_SEQ', () => {
    it('should convert objects to JSON-Seq format with record separator', () => {
      const obj = { name: 'test', value: 123 };
      const result = convertSampleToString(obj, MediaTypes.JSON_SEQ);
      expect(result).toBe('0x1E{"name":"test","value":123}0x0A');
    });

    it('should convert objects with repeat flag to 3 duplicated items', () => {
      const obj = { name: 'test', value: 123 };
      const result = convertSampleToString(obj, MediaTypes.JSON_SEQ, undefined, true);
      const expected =
        '0x1E{"name":"test","value":123}0x0A\n0x1E{"name":"test","value":123}0x0A\n0x1E{"name":"test","value":123}0x0A';
      expect(result).toBe(expected);
    });
  });

  describe('non-object passthrough for JSON streaming media types', () => {
    const streamingMediaTypes = [MediaTypes.JSONL, MediaTypes.NDJSON, MediaTypes.JSON_SEQ] as const;

    it.each(streamingMediaTypes)('keeps primitive values unchanged for %s', (mediaType) => {
      expect(convertSampleToString('string', mediaType)).toBe('string');
      expect(convertSampleToString(42, mediaType)).toBe(42);
      expect(convertSampleToString(null, mediaType)).toBe(null);
    });
  });

  describe('MULTIPART_MIXED', () => {
    it('should convert objects to multipart format', () => {
      const obj = { name: 'test' };
      const result = convertSampleToString(obj, MediaTypes.MULTIPART_MIXED);
      expect(typeof result).toBe('string');
      expect(result).toContain('Content-Type: application/json');
      expect(result).toContain('boundary-separator');
      expect(result).toContain('"name": "test"');
    });

    it('should convert arrays to multipart format', () => {
      const arr = [{ name: 'test1' }, { name: 'test2' }];
      const result = convertSampleToString(arr, MediaTypes.MULTIPART_MIXED);
      expect(typeof result).toBe('string');
      expect(result).toContain('boundary-separator');
    });

    it('should not convert null values', () => {
      const result = convertSampleToString(null, MediaTypes.MULTIPART_MIXED);
      expect(result).toBe(null);
    });

    it('should handle primitive values', () => {
      const result = convertSampleToString('test', MediaTypes.MULTIPART_MIXED);
      expect(typeof result).toBe('string');
      expect(result).toContain('boundary-separator');
    });

    it('should emit binary placeholder for fields with format binary', () => {
      const obj = { file: 'string' };
      const schema = {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary' },
        },
      };
      const result = convertSampleToString(obj, MediaTypes.MULTIPART_MIXED, schema);
      expect(typeof result).toBe('string');
      expect(result).toContain('[Binary data]');
    });

    it('should honor prefixItems for mixed json+binary multipart payloads', () => {
      const value = [
        { metadata: { documentId: 'doc_123', title: 'Report.pdf', size: 1024000 } },
        'string',
      ];
      const schema = {
        type: 'array',
        prefixItems: [
          {
            type: 'object',
            properties: {
              metadata: {
                type: 'object',
                properties: {
                  documentId: { type: 'string', example: 'doc_123' },
                  title: { type: 'string', example: 'Report.pdf' },
                  size: { type: 'integer', example: 1024000 },
                },
              },
            },
          },
          {
            type: 'string',
            format: 'binary',
            contentMediaType: 'application/pdf',
          },
        ],
      };

      const result = convertSampleToString(value, MediaTypes.MULTIPART_MIXED, schema);
      expect(typeof result).toBe('string');
      expect(result).toContain('Content-Type: application/json');
      expect(result).toContain('Content-Type: application/pdf');
      expect(result).toContain('Content-Transfer-Encoding: binary');
      expect(result).toContain('[Binary data]');
      expect(result).not.toContain('Content-Type: text/plain');
    });
  });

  describe('non-streaming media types', () => {
    it('should not convert for application/json', () => {
      const obj = { name: 'test' };
      const result = convertSampleToString(obj, MediaTypes.JSON);
      expect(result).toBe(obj);
    });

    it('should not convert for text/plain', () => {
      const value = 'test string';
      const result = convertSampleToString(value, 'text/plain');
      expect(result).toBe(value);
    });
  });
});
