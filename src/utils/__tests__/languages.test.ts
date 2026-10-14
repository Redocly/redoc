import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LANGUAGES,
  getGeneratorKey,
  getLangKey,
  getSyntaxHighlightLang,
} from '../languages.js';

describe('getLangKey', () => {
  it('maps a config label to its generator key', () => {
    expect(getLangKey({ lang: 'Node.js' })).toBe('node');
    expect(getLangKey({ lang: 'C#' })).toBe('csharp');
    expect(getLangKey({ lang: 'C#+Newtonsoft' })).toBe('csharpnewtonsoft');
    expect(getLangKey({ lang: 'Java8+Apache' })).toBe('java8');
    expect(getLangKey({ lang: 'Payload' })).toBe('payload');
  });

  it('lets a custom label name the language', () => {
    expect(getLangKey({ lang: 'curl', label: 'Shell' })).toBe('shell');
  });

  it('lowercases an unknown language rather than dropping it', () => {
    expect(getLangKey({ lang: 'Kotlin' })).toBe('kotlin');
  });
});

describe('getGeneratorKey', () => {
  it('derives the generator language from lang, ignoring a custom label', () => {
    expect(getGeneratorKey({ lang: 'curl' })).toBe('curl');
    expect(getGeneratorKey({ lang: 'Node.js' })).toBe('node');
    expect(getGeneratorKey({ lang: 'C#+Newtonsoft' })).toBe('csharpnewtonsoft');
    // A renamed tab still generates its language.
    const renamed = { lang: 'curl', label: 'Shell' };
    expect(getGeneratorKey(renamed)).toBe('curl');
    expect(getLangKey(renamed)).toBe('shell');
    expect(getGeneratorKey({ lang: 'Payload' })).toBe('payload');
  });

  it('lowercases an unknown language rather than dropping it', () => {
    expect(getGeneratorKey({ lang: 'Kotlin' })).toBe('kotlin');
  });
});

describe('getSyntaxHighlightLang', () => {
  it('maps each language name to its highlighter grammar', () => {
    expect(getSyntaxHighlightLang('curl')).toBe('bash');
    expect(getSyntaxHighlightLang('Node.js')).toBe('javascript');
    expect(getSyntaxHighlightLang('C#')).toBe('csharp');
    expect(getSyntaxHighlightLang('C#+Newtonsoft')).toBe('csharp');
    expect(getSyntaxHighlightLang('Java8+Apache')).toBe('java');
  });

  it('renders Payload as JSON — `payload` is not a real grammar', () => {
    expect(getSyntaxHighlightLang('Payload')).toBe('json');
  });

  it('collapses Node.js and JavaScript onto one grammar, so a grammar cannot name a language', () => {
    expect(getSyntaxHighlightLang('Node.js')).toBe(getSyntaxHighlightLang('JavaScript'));
    expect(getGeneratorKey({ lang: 'Node.js' })).not.toBe(getGeneratorKey({ lang: 'JavaScript' }));
  });

  it('lowercases an unknown language as its own grammar rather than dropping it', () => {
    expect(getSyntaxHighlightLang('Kotlin')).toBe('kotlin');
  });

  it('resolves a grammar for every default language name', () => {
    for (const language of DEFAULT_LANGUAGES) {
      expect(getSyntaxHighlightLang(language.label)).toMatch(/^[a-z]+$/);
    }
  });
});
