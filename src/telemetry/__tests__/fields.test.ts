import { describe, expect, it } from 'vitest';

import { DEFAULT_LANGUAGES } from '../../utils/languages.js';
import { languageOf, normalizeProtocol, statusClassOf } from '../fields.js';

describe('statusClassOf', () => {
  it('reduces a response code to its class', () => {
    expect(statusClassOf('200')).toBe('2xx');
    expect(statusClassOf('404')).toBe('4xx');
    expect(statusClassOf('5XX')).toBe('5xx');
    expect(statusClassOf('1xx')).toBe('1xx');
  });

  it('maps everything else to default', () => {
    expect(statusClassOf('default')).toBe('default');
    expect(statusClassOf('')).toBe('default');
    expect(statusClassOf('6xx')).toBe('default');
  });
});

describe('normalizeProtocol', () => {
  it('accepts protocol names and URL schemes, case-insensitively', () => {
    expect(normalizeProtocol('kafka')).toBe('kafka');
    expect(normalizeProtocol('KAFKA-SECURE')).toBe('kafka-secure');
    expect(normalizeProtocol('https://api.example.com/v1')).toBe('https');
    expect(normalizeProtocol('mqtt:')).toBe('mqtt');
    expect(normalizeProtocol(' wss ')).toBe('wss');
  });

  it('reports anything outside the list as other', () => {
    expect(normalizeProtocol(undefined)).toBe('other');
    expect(normalizeProtocol('')).toBe('other');
    expect(normalizeProtocol('carrier-pigeon')).toBe('other');
    expect(normalizeProtocol('/relative/path')).toBe('other');
  });
});

describe('languageOf', () => {
  it('reports every built-in sample language under its key', () => {
    for (const { key, lang } of DEFAULT_LANGUAGES) {
      expect(languageOf(key)).toBe(key);
      expect(languageOf(lang)).not.toBe('other');
    }
  });

  it.each([
    ['C#', 'csharp'],
    ['Node.js', 'node'],
    ['cURL', 'curl'],
    ['C#+Newtonsoft', 'csharpnewtonsoft'],
    ['json', 'json'],
    ['XML', 'xml'],
    ['graphql', 'graphql'],
    ['text', 'text'],
  ])('maps %s to %s', (value, expected) => {
    expect(languageOf(value)).toBe(expected);
  });

  it.each(['Acme Payments SDK', 'acme-cli', 'x-python', ''])(
    'reports spec-authored text %j as other',
    (value) => {
      expect(languageOf(value)).toBe('other');
    },
  );
});
