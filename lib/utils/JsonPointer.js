'use strict';
import JsonPointerLib from 'json-pointer';

/**
 * Wrapper for JsonPointer. Provides common operations
 */
export class JsonPointer extends JsonPointerLib {

  /**
   * returns last JsonPointer token
   * if level > 1 returns levels last (second last/third last)
   * @example
   * // returns subpath
   * JsonPointerHelper.baseName('/path/0/subpath')
   * // returns foo
   * JsonPointerHelper.baseName('/path/foo/subpath', 2)
   */
   static baseName(pointer, level=1) {
     let tokens = JsonPointer.parse(pointer);
     return tokens[tokens.length - (level)];
   }
}

export default JsonPointer;
