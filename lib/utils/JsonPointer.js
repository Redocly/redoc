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
   static dirName(pointer) {
     return JsonPointer.parse(pointer).pop();
   }
}
