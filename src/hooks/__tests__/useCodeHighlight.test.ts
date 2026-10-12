import { describe, expect, it } from 'vitest';

import { highlight } from '../useCodeHighlight.js';
import { DEFAULT_LANGUAGES, getSyntaxHighlightLang } from '../../utils/languages.js';
import { langFromMime } from '../../utils/media-type.js';

const languageOf = (html: string) => html.match(/data-language="([^"]+)"/)?.[1];

describe('highlight', () => {
  it('escapes source that would otherwise run as HTML', () => {
    const html = highlight('<img src=x onerror=alert(1)>', 'html');

    expect(html.replace(/<\/?(?:code|span)[^>]*>/g, '')).toBe('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img');
  });

  it('escapes source of an unknown language instead of passing it through raw', () => {
    const html = highlight('<script>alert(1)</script>', 'brainfuck');

    expect(languageOf(html)).toBe('plaintext');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it.each(
    [...DEFAULT_LANGUAGES.map((language) => language.label), 'C#+Newtonsoft', 'Java8+Apache']
      .map(getSyntaxHighlightLang)
      .filter((lang) => lang !== 'r'),
  )('has a grammar for the %s code-sample language', (lang) => {
    expect(languageOf(highlight('x', lang))).not.toBe('plaintext');
  });

  it.each([
    'application/json',
    'application/xml',
    'application/json-seq',
    'application/jsonl',
    'application/x-ndjson',
    'multipart/mixed',
    'text/event-stream',
  ])('has a grammar for the %s media type', (mediaType) => {
    expect(languageOf(highlight('x', langFromMime(mediaType)))).not.toBe('plaintext');
    expect(languageOf(highlight('x', mediaType))).not.toBe('plaintext');
  });

  it('highlights a curl sample as shell', () => {
    const html = highlight(
      "curl -i -X GET \\\n  -u <username>:<password> \\\n  'http://example.com/x'",
      'curl',
    );

    expect(languageOf(html)).toBe('shell');
    expect(html).toContain('th-command');
    expect(html).toContain('th-string');
    expect(html).toContain('&lt;username&gt;');
  });

  it('colors JSON keys as properties and values as strings', () => {
    const html = highlight('{"id": "abc", "count": 1}', 'json');

    expect(html).toContain(
      '<span class="th-token th-property" style="color: var(--code-block-tokens-property-string-color)">&quot;id&quot;</span>',
    );
    expect(html).toContain(
      '<span class="th-token th-string" style="color: var(--code-block-tokens-string-color)">&quot;abc&quot;</span>',
    );
    expect(html).toContain('th-number');
  });

  it('colors YAML keys as tags', () => {
    const html = highlight('id: abc', 'yaml');

    expect(html).toContain('style="color: var(--code-block-tokens-tag-color)">id</span>');
    expect(html).not.toContain('--code-block-tokens-property-string-color');
  });

  it.each([
    ['c', 'int main(void) { return puts("hi"); } // done'],
    ['cpp', 'class A { public: const char* s = "hi"; }; /* note */'],
    ['csharp', 'public class A { string s = "hi"; } // note'],
    ['go', 'func main() { fmt.Println("hi") } // note'],
    ['graphql', 'query A { user(name: "hi") { id } } # note'],
    ['java', 'public class A { String s = "hi"; } // note'],
    ['kotlin', 'fun main() { val s = "hi" } // note'],
    ['objective-c', '@interface A : NSObject\nNSString *s = @"hi"; // note\n@end'],
    ['perl', 'sub f { my $s = "hi"; return $s; } # note'],
    ['php', '<?php function f() { return "hi"; } // note ?>'],
    ['ruby', 'def f\n  "hi" # note\nend'],
    ['scala', 'object A { val s = "hi" } // note'],
    ['swift', 'func f() -> String { return "hi" } // note'],
    ['python', 'def f():\n    return "hi"  # note'],
    ['javascript', 'const s = "hi"; // note'],
  ])('highlights %s keywords, strings and comments', (language, source) => {
    const html = highlight(source, language);

    expect(html).toContain('th-keyword');
    expect(html).toContain('th-string');
    expect(html).toContain('th-comment');
  });

  it('maps aliases onto the grammars that carry them', () => {
    expect(languageOf(highlight('int a;', 'c++'))).toBe('c');
    expect(languageOf(highlight('var a = 1;', 'C#'))).toBe('csharp');
    expect(languageOf(highlight('var a = 1;', 'C#+Newtonsoft'))).toBe('csharp');
    expect(languageOf(highlight('int a;', 'Java8+Apache'))).toBe('java');
    expect(languageOf(highlight('const a = 1;', 'Node.js'))).toBe('js');
    expect(languageOf(highlight('id a;', 'objectivec'))).toBe('objective-c');
    expect(languageOf(highlight('<a href="x"/>', 'xml'))).toBe('html');
    expect(languageOf(highlight('--boundary', 'multipart-mixed'))).toBe('http');
    expect(languageOf(highlight('data: 1', 'sse'))).toBe('yaml');
    expect(languageOf(highlight('{}', 'ndjson'))).toBe('json');
    expect(languageOf(highlight('x', 'clike'))).toBe('plaintext');
    expect(languageOf(highlight('x', undefined))).toBe('plaintext');
  });

  it('numbers lines from `startLineNumber` only when asked', () => {
    const numbered = highlight('one\ntwo', 'text', { startLineNumber: 10, withLineNumbers: true });
    expect(numbered).toContain('data-line-number="10"');
    expect(numbered).toContain('data-line-number="11"');

    const plain = highlight('one\ntwo\n', 'text');
    expect(plain.match(/<span class="th-line line"/g)).toHaveLength(2);
    expect(plain).not.toContain('data-line-number');
  });

  it('never emits legacy `token` classes', () => {
    expect(highlight('const a = {"b": 1};', 'javascript')).not.toContain('class="token');
  });
});
