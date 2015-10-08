'use strict';
import JsonPointerLib from 'json-pointer';

/**
 * Wrapper for JsonPointer. Provides common operations
 */
export class JsonPointer extends JsonPointerLib {

  /**
   * returns last JsonPointer token
   * @example
   * // returns subpath
   * new JsonPointerHelper.dirName('/path/0/subpath')
   */
   static dirName(pointer, level=1) {
     var tokens = JsonPointer.parse(pointer);
     return tokens[tokens.length - (level)];
   }
}

export default JsonPointer;
