import { defineLanguage } from '@tanstack/highlight';

import type { HighlightTokenClass, TokenRange } from '@tanstack/highlight';

type Pattern = {
  className: HighlightTokenClass | ((match: RegExpMatchArray) => HighlightTokenClass);
  regex: RegExp;
  group?: number;
};

function collectRanges(code: string, patterns: ReadonlyArray<Pattern>): Array<TokenRange> {
  const ranges: Array<TokenRange> = [];
  const occupied = new Uint8Array(code.length);
  for (const { className, regex, group } of patterns) {
    for (const match of code.matchAll(regex)) {
      const value = group ? match[group] : match[0];
      if (!value) {
        continue;
      }
      const start = match.index + (group ? match[0].indexOf(value) : 0);
      const end = start + value.length;
      if (occupied.subarray(start, end).some(Boolean)) {
        continue;
      }
      occupied.fill(1, start, end);
      ranges.push({
        className: typeof className === 'function' ? className(match) : className,
        start,
        end,
      });
    }
  }
  return ranges;
}

/** Matches whole words from a space-separated list. */
function words(className: HighlightTokenClass, list: string): Pattern {
  return { className, regex: new RegExp(`\\b(?:${list.split(' ').join('|')})\\b`, 'g') };
}

/** One regex for comments and strings, so a comment marker inside a string stays a string. */
function commentsAndStrings(regex: RegExp, comment: RegExp): Pattern {
  return { className: (match) => (comment.test(match[0]) ? 'comment' : 'string'), regex };
}

const C_COMMENTS_AND_STRINGS = commentsAndStrings(
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/g,
  /^\/[/*]/,
);
const TRIPLE_QUOTED_C_COMMENTS_AND_STRINGS = commentsAndStrings(
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/g,
  /^\/[/*]/,
);
const NUMBER: Pattern = {
  className: 'number',
  regex: /\b(?:0x[\da-f_']+|0b[01_']+|\d[\d_']*(?:\.\d[\d_]*)?(?:e[+-]?\d[\d_]*)?[a-z]*)\b/gi,
};
const FUNCTION_CALL: Pattern = {
  className: 'function',
  regex: /\b([A-Za-z_]\w*)(?=\s*\()/g,
  group: 1,
};
const CAPITALIZED_TYPE: Pattern = { className: 'type', regex: /\b[A-Z]\w*\b/g };
const ANNOTATION: Pattern = { className: 'meta', regex: /@[A-Za-z_][\w.]*/g };
const C_PREPROCESSOR: Pattern = { className: 'meta', regex: /^[ \t]*#[ \t]*\w+/gm };

const C_KEYWORDS =
  'auto break case const continue default do else enum extern for goto if inline register restrict return sizeof static struct switch typedef union volatile while';
const C_TYPES = 'bool char double float int long short signed unsigned void size_t';

/** A grammar from claim-ordered patterns: an earlier pattern wins an overlap. */
function patternLanguage(name: string, aliases: Array<string>, patterns: Array<Pattern>) {
  return defineLanguage({ name, aliases, tokenize: (code) => collectRanges(code, patterns) });
}

/**
 * Code-sample languages `@tanstack/highlight` ships no grammar for. Each is a claim-ordered
 * pattern list in the style of the bundled grammars; `cpp` fences use the C grammar, which
 * also knows the C++ keywords.
 */
export const extraLanguages = [
  patternLanguage(
    'c',
    ['cpp', 'c++', 'cc', 'h', 'hpp'],
    [
      C_COMMENTS_AND_STRINGS,
      C_PREPROCESSOR,
      words(
        'keyword',
        `${C_KEYWORDS} alignas alignof catch class constexpr const_cast decltype delete dynamic_cast explicit friend mutable namespace new noexcept operator private protected public reinterpret_cast static_assert static_cast template this throw try typeid typename using virtual`,
      ),
      words('type', C_TYPES),
      words('literal', 'true false NULL nullptr'),
      FUNCTION_CALL,
      NUMBER,
    ],
  ),
  patternLanguage(
    'objective-c',
    ['objectivec', 'objc'],
    [
      C_COMMENTS_AND_STRINGS,
      C_PREPROCESSOR,
      { className: 'keyword', regex: /@[A-Za-z]+/g },
      words('keyword', `${C_KEYWORDS} self super id instancetype`),
      words('type', `${C_TYPES} BOOL NSInteger NSUInteger`),
      words('literal', 'YES NO nil Nil NULL'),
      FUNCTION_CALL,
      NUMBER,
    ],
  ),
  patternLanguage(
    'csharp',
    ['c#', 'cs', 'c#+newtonsoft', 'dotnet'],
    [
      C_COMMENTS_AND_STRINGS,
      C_PREPROCESSOR,
      words(
        'keyword',
        'abstract as async await base break case catch checked class const continue default delegate do else enum event explicit extern finally fixed for foreach get goto if implicit in init interface internal is lock namespace new operator out override params private protected public readonly record ref return sealed set sizeof stackalloc static struct switch this throw try typeof unchecked unsafe using value var virtual volatile when where while yield',
      ),
      words(
        'type',
        'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort void',
      ),
      words('literal', 'true false null'),
      FUNCTION_CALL,
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
  patternLanguage(
    'java',
    ['java8+apache'],
    [
      C_COMMENTS_AND_STRINGS,
      ANNOTATION,
      words(
        'keyword',
        'abstract assert break case catch class const continue default do else enum extends final finally for goto if implements import instanceof interface native new package permits private protected public record return sealed static strictfp super switch synchronized this throw throws transient try var volatile while yield',
      ),
      words('type', 'boolean byte char double float int long short void'),
      words('literal', 'true false null'),
      FUNCTION_CALL,
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
  patternLanguage(
    'kotlin',
    ['kt', 'kts'],
    [
      TRIPLE_QUOTED_C_COMMENTS_AND_STRINGS,
      ANNOTATION,
      words(
        'keyword',
        'abstract annotation as break by catch class companion const constructor continue crossinline data do else enum external final finally for fun get if import in infix init inline inner interface internal is lateinit noinline object open operator out override package private protected public reified return sealed set super suspend tailrec this throw try typealias val var vararg when where while',
      ),
      words('literal', 'true false null'),
      FUNCTION_CALL,
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
  patternLanguage(
    'scala',
    ['sc'],
    [
      TRIPLE_QUOTED_C_COMMENTS_AND_STRINGS,
      ANNOTATION,
      words(
        'keyword',
        'abstract case catch class def do else end enum export extends final finally for forSome given if implicit import lazy match new object override package private protected return sealed super then this throw trait try type using val var while with yield',
      ),
      words('literal', 'true false null'),
      FUNCTION_CALL,
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
  patternLanguage(
    'swift',
    [],
    [
      TRIPLE_QUOTED_C_COMMENTS_AND_STRINGS,
      ANNOTATION,
      { className: 'meta', regex: /#\w+/g },
      words(
        'keyword',
        'actor any as associatedtype async await break case catch class continue default defer deinit do else enum extension fallthrough fileprivate for func guard if import in init inout internal is let open operator private protocol public repeat rethrows return self Self some static struct subscript super switch throw throws try typealias var where while',
      ),
      words('literal', 'true false nil'),
      FUNCTION_CALL,
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
  patternLanguage(
    'go',
    ['golang'],
    [
      commentsAndStrings(
        /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\\n])*"|`[^`]*`|'(?:\\.|[^'\\\n])*'/g,
        /^\/[/*]/,
      ),
      words(
        'keyword',
        'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var',
      ),
      words(
        'type',
        'any bool byte complex64 complex128 error float32 float64 int int8 int16 int32 int64 rune string uint uint8 uint16 uint32 uint64 uintptr',
      ),
      words('literal', 'true false nil iota'),
      FUNCTION_CALL,
      NUMBER,
    ],
  ),
  patternLanguage(
    'graphql',
    ['gql'],
    [
      commentsAndStrings(/#[^\n]*|"""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"/g, /^#/),
      words(
        'keyword',
        'directive enum extend fragment implements input interface mutation on query repeatable scalar schema subscription type union',
      ),
      words('literal', 'true false null'),
      { className: 'variable', regex: /\$\w+/g },
      { className: 'meta', regex: /@\w+/g },
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
  patternLanguage(
    'perl',
    ['pl'],
    [
      commentsAndStrings(/#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, /^#/),
      { className: 'variable', regex: /[$@%][A-Za-z_][\w:]*/g },
      words(
        'keyword',
        'and cmp do else elsif eq foreach for ge gt if last le local lt my ne next no not or our package print qq qw redo require return sub unless until use while xor',
      ),
      FUNCTION_CALL,
      NUMBER,
    ],
  ),
  patternLanguage(
    'php',
    [],
    [
      commentsAndStrings(
        /\/\/[^\n]*|#(?!\[)[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
        /^(?:\/[/*]|#)/,
      ),
      { className: 'meta', regex: /<\?(?:php|=)?|\?>/g },
      { className: 'variable', regex: /\$\w+/g },
      words(
        'keyword',
        'abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enum extends final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface isset list match namespace new or print private protected public readonly require require_once return static switch throw trait try unset use var while xor yield',
      ),
      { className: 'literal', regex: /\b(?:true|false|null)\b/gi },
      FUNCTION_CALL,
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
  patternLanguage(
    'ruby',
    ['rb'],
    [
      commentsAndStrings(
        /^=begin[\s\S]*?^=end|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/gm,
        /^(?:=begin|#)/,
      ),
      { className: 'literal', regex: /(?<![:\w]):[A-Za-z_]\w*[?!]?/g },
      { className: 'variable', regex: /@{1,2}\w+|\$\w+/g },
      words(
        'keyword',
        'alias and attr_accessor attr_reader attr_writer begin break case class def defined do else elsif end ensure extend for if in include lambda module next not or private proc protected public puts raise redo require require_relative rescue retry return self super then undef unless until when while yield',
      ),
      words('literal', 'true false nil'),
      CAPITALIZED_TYPE,
      NUMBER,
    ],
  ),
];
