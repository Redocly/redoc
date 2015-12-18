'use strict';

import {JsonPointer} from 'lib/utils/JsonPointer';
// test extended JsonPointer

describe('JsonPointer', () => {
  it('should return correct base name', ()=> {
    JsonPointer.baseName('/level1/level2/name').should.be.equal('name');
    JsonPointer.baseName('/level1/level2/name', 2).should.be.equal('level2');
    JsonPointer.baseName('/level1/level2/name', 3).should.be.equal('level1');
  });

  it('should return correct dir name', ()=> {
    JsonPointer.dirName('/level1/level2/name').should.be.equal('/level1/level2');
    JsonPointer.dirName('/level1/level2/name', 2).should.be.equal('/level1');
    JsonPointer.dirName('/level1/level2/name', 3).should.be.equal('');
  });

  it('should handle relative pointers (starting with #) without errors', ()=> {
    JsonPointer.parse('#/level1/level2/name').should.be.deepEqual(['level1', 'level2', 'name']);
  });

  it('should join correctly', ()=> {
    JsonPointer.join('#/level1', ['level2', 'name']).should.be.equal('/level1/level2/name');
  });
});
