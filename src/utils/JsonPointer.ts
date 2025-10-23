'use strict';
import JsonPointerLib from 'json-pointer';

const origParse = JsonPointerLib.parse;
/**
 * Wrapper for JsonPointer. Provides common operations
 */

export class JsonPointer {
  /**
   * returns last JsonPointer token
   * if level > 1 returns levels last (second last/third last)
   * @example
   * // returns subpath
   * JsonPointerHelper.baseName('/path/0/subpath')
   * // returns foo
   * JsonPointerHelper.baseName('/path/foo/subpath', 2)
   */
  static baseName(pointer = '', level = 1): string {
    const tokens = JsonPointer.parse(pointer);
    return tokens[tokens.length - level];
  }

  /**
   * returns dirname of pointer
   * if level > 1 returns corresponding dirname in the hierarchy
   * @example
   * // returns /path/0
   * JsonPointerHelper.dirName('/path/0/subpath')
   * // returns /path
   * JsonPointerHelper.dirName('/path/foo/subpath', 2)
   */
  static dirName(pointer: string, level = 1): string {
    const tokens = JsonPointer.parse(pointer);
    return JsonPointerLib.compile(tokens.slice(0, tokens.length - level));
  }

  /**
   * returns relative path tokens
   * @example
   * // returns ['subpath']
   * JsonPointerHelper.relative('/path/0', '/path/0/subpath')
   * // returns ['foo', 'subpath']
   * JsonPointerHelper.relative('/path', '/path/foo/subpath')
   */
  static relative(from: string, to: string): string[] {
    const fromTokens = JsonPointer.parse(from);
    const toTokens = JsonPointer.parse(to);
    return toTokens.slice(fromTokens.length);
  }

  /**
   * overridden JsonPointer original parse to take care of prefixing '#' symbol
   * that is not valid JsonPointer
   */
  static parse(pointer = ''): string[] {
    let ptr = pointer;
    if (ptr.charAt(0) === '#') {
      ptr = ptr.substring(1);
    }
    return origParse(ptr);
  }

  /**
   * Creates a JSON pointer path, by joining one or more tokens to a base path.
   *
   * @param {string} base - The base path
   * @param {string|string[]} tokens - The token(s) to append (e.g. ["name", "first"])
   * @returns {string}
   */
  static join(base: string, tokens: string | string[]): string {
    // TODO: optimize
    const baseTokens = JsonPointer.parse(base);
    const resTokens = baseTokens.concat(tokens);
    return JsonPointerLib.compile(resTokens);
  }

  static get<T>(object: GenericObject, pointer: string): T {
    return JsonPointerLib.get(object, pointer);
  }

  static compile(tokens: string[]): string {
    return JsonPointerLib.compile(tokens);
  }

  static escape(pointer: string): string {
    return JsonPointerLib.escape(pointer);
  }
}
(JsonPointerLib as any).parse = JsonPointer.parse;
Object.assign(JsonPointer, JsonPointerLib);
export default JsonPointer;
