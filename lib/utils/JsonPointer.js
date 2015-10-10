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

   /**
    * returns dirname of pointer
    * if level > 1 returns corresponding dirname in the hierarchy
    * @example
    * // returns /path/0
    * JsonPointerHelper.dirName('/path/0/subpath')
    * // returns /path
    * JsonPointerHelper.dirName('/path/foo/subpath', 2)
    */
   static dirName(pointer, level=1) {
     let tokens = JsonPointer.parse(pointer);
     return JsonPointer.compile(tokens.slice(0, tokens.length - level));
   }

   /**
    * overridden JsonPointer original parse to take care of prefixing '#' symbol
    * that is not valid JsonPointer
    */
   static parse(pointer) {
     let ptr = pointer;
     if (ptr.charAt(0) === '#') {
       ptr = ptr.substring(1);
     }
     return JsonPointerLib.parse(ptr);
   }
}
export default JsonPointer;
