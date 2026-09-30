import Prism from 'prismjs';
// Prism component imports are order-sensitive: each grammar that uses
// `Prism.languages.extend(parent, ...)` must be imported AFTER its parent,
// otherwise the parent is undefined at load time and the resulting grammar
// is missing every inherited token. Keep the base grammars at the top, then
// their descendants, and do not "sort" this list alphabetically.

// Base grammars (no Prism dependencies).
import 'prismjs/components/prism-clike.js';
import 'prismjs/components/prism-markup.js'; // xml; also used by markup-templating at runtime
import 'prismjs/components/prism-markup-templating.js'; // dep of php; references markup at runtime
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-http.js';
import 'prismjs/components/prism-lua.js';
import 'prismjs/components/prism-perl.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-q.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-csv.js';

// Grammars that extend `clike`.
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-ruby.js';

// Grammars that extend a non-`clike` parent imported above.
import 'prismjs/components/prism-cpp.js'; // extends c
import 'prismjs/components/prism-objectivec.js'; // extends c
import 'prismjs/components/prism-scala.js'; // extends java
import 'prismjs/components/prism-coffeescript.js'; // extends javascript
import 'prismjs/components/prism-php.js'; // uses markup-templating at runtime

import { normalizeLanguageForHighlight } from '../utils/media-type.js';

const DEFAULT_LANG = 'clike';

// Prism is loaded as a CJS module under Node ESM via portal SSR. Some bundlers
// surface it as a namespace where the real export sits on `.default`, so we
// normalize before touching `languages`.
const PrismLib: typeof Prism = (Prism as unknown as { default?: typeof Prism }).default ?? Prism;

let prismCustomGrammarsRegistered = false;

function registerPrismCustomGrammars(): void {
  if (prismCustomGrammarsRegistered || !PrismLib?.languages) return;
  prismCustomGrammarsRegistered = true;

  PrismLib.languages.insertBefore('bash', 'operator', {
    placeholder: {
      pattern: /<\w+>/,
      alias: 'string',
    },
  });

  PrismLib.languages.insertBefore(
    'javascript',
    'string',
    {
      'property string': {
        pattern: /([{,]\s*)"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
        lookbehind: true,
      },
    } as any,
    undefined as any,
  );

  PrismLib.languages.insertBefore(
    'javascript',
    'punctuation',
    {
      property: {
        pattern: /([{,]\s*)[a-z]\w*(?=\s*:)/i,
        lookbehind: true,
      },
    },
    undefined as any,
  );

  // JSON-Seq grammar (JSON with record separator 0x1E and line feed 0x0A).
  PrismLib.languages['json-seq'] = {
    separator: {
      pattern: /0x1E|0x0A/g,
      alias: 'keyword',
    },
    ...PrismLib.languages.javascript,
  };

  // Multipart/Mixed grammar (boundaries, headers, and content).
  PrismLib.languages['multipart-mixed'] = {
    boundary: {
      pattern: /^--[\w-]+(?:--)?$/m,
      alias: 'keyword',
    },
    header: {
      pattern: /^[\w-]+:\s*\S.*$/m,
      inside: {
        'header-name': {
          pattern: /^[\w-]+/,
          alias: 'property',
        },
        'header-value': {
          pattern: /^:\s*\S.*$/,
          alias: 'string',
        },
      },
    },
    json: {
      pattern: /\{(?<!\{[^}]*?\{)[\s\S]*?\}|\[(?<!\[[^\]]*?\[)[\s\S]*?\]/,
      inside: PrismLib.languages.javascript,
    },
    placeholder: {
      pattern: /\[Binary data\]|\[Base64 encoded data\]/g,
      alias: 'comment',
    },
  };
}

/** Map language names to Prism.js names. */
export function mapLang(lang: string): string {
  const normalized = normalizeLanguageForHighlight(lang);

  return (
    {
      json: 'js',
      jsonl: 'js',
      ndjson: 'js',
      'json-seq': 'json-seq',
      'multipart-mixed': 'multipart-mixed',
      sse: 'yaml',
      'c++': 'cpp',
      'c#': 'csharp',
      'objective-c': 'objectivec',
      shell: 'bash',
      viml: 'vim',
    }[normalized] || DEFAULT_LANG
  );
}

/** Highlight source code string using Prism.js and return HTML. */
export function useCodeHighlight(
  source: string | number | boolean,
  lang: string = DEFAULT_LANG,
): string {
  registerPrismCustomGrammars();

  const normalizedLang = lang.toLowerCase();
  const mappedLang = mapLang(normalizedLang);

  const grammar =
    PrismLib.languages[normalizedLang] ||
    PrismLib.languages[mappedLang] ||
    PrismLib.languages[DEFAULT_LANG];

  const languageForPrism = PrismLib.languages[mappedLang]
    ? mappedLang
    : PrismLib.languages[normalizedLang]
      ? normalizedLang
      : DEFAULT_LANG;

  return PrismLib.highlight(source.toString(), grammar, languageForPrism);
}
