'use strict';

import {KeysPipe, ValuesPipe, JsonPointerEscapePipe, MarkedPipe} from 'lib/utils/pipes';

describe('KeysPipe and ValuesPipe', () => {
  let obj;
  var keysPipe, valuesPipe;

  beforeEach(() => {
    obj = {
      a: 1,
      b: 2,
      c: 3
    };
    keysPipe = new KeysPipe();
    valuesPipe = new ValuesPipe();
  });

  describe('KeysPipe transform', () => {
    it('should return keys', () => {
      var val = keysPipe.transform(obj);
      val.should.be.deep.equal(['a', 'b', 'c']);
    });

    it('should not support other objects', () => {
      (() => keysPipe.transform(45)).should.throw();
      (() => keysPipe.transform(null)).should.throw();
    });
  });

  describe('KeysPipe transform', () => {
    it('should return values', () => {
      var val = valuesPipe.transform(obj);
      val.should.be.deep.equal([1, 2, 3]);
    });

    it('should not support other objects', () => {
      (() => valuesPipe.transform(45)).should.throw();
      (() => valuesPipe.transform(null)).should.throw();
    });
  });
});

describe('JsonPointerEscapePipe', () => {
  let unescaped;
  let escaped;
  var pipe;

  beforeEach(() => {
    unescaped = 'test/path~1';
    escaped = 'test~1path~01';
    pipe = new JsonPointerEscapePipe();
  });

  describe('KeysPipe transform', () => {
    it('should escpae pointer', () => {
      var val = pipe.transform(unescaped);
      val.should.be.equal(escaped);
    });

    it('should not support other objects', () => {
      (() => pipe.transform(45)).should.throw();
      (() => pipe.transform({})).should.throw();
    });
  });
});

describe('MarkedPipe', () => {
  let unmarked;
  let marked;
  var pipe;

  beforeEach(() => {
    unmarked = 'test\n';
    marked = '<p>test</p>\n';
    pipe = new MarkedPipe();
  });

  describe('KeysPipe transform', () => {
    it('should escpae pointer', () => {
      var val = pipe.transform(unmarked);
      val.should.be.equal(marked);
    });

    it('should not support other objects', () => {
      (() => pipe.transform(45)).should.throw();
      (() => pipe.transform({})).should.throw();
    });
  });
});
