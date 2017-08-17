'use strict';

import {KeysPipe, MarkedPipe} from '../../lib/utils/pipes';

describe('Pipes', () => {
  describe('KeysPipe', () => {
    let obj;
    var keysPipe;

    beforeEach(() => {
      obj = {
        a: 1,
        b: 2,
        c: 3
      };
      keysPipe = new KeysPipe();
    });

    describe('KeysPipe transform', () => {
      it('should return keys', () => {
        var val = keysPipe.transform(obj);
        val.should.be.deepEqual(['a', 'b', 'c']);
      });

      it('should not support other objects', () => {
        (() => keysPipe.transform(45)).should.throw();
        (() => keysPipe.transform('45')).should.throw();
      });

      it('should not throw on blank input', () => {
        (() => keysPipe.transform()).should.not.throw();
      });
    });
  });

  describe('MarkedPipe', () => {
    let unmarked;
    let marked;
    var pipe;

    beforeEach(() => {
      unmarked = 'test\n';
      marked = '<span class="redoc-markdown-block"><p>test</p>\n</span>';
      pipe = new MarkedPipe();
    });

    describe('MarkedPipe transform', () => {
      it('should wrap in markdown span', () => {
        var val = pipe.transform(unmarked);
        val.should.be.equal(marked);
      });

      it('should not support other objects', () => {
        (() => pipe.transform(45)).should.throw();
        (() => pipe.transform({})).should.throw();
      });

      it('should not throw on blank input', () => {
        (() => pipe.transform()).should.not.throw();
      });
    });
  });
});
