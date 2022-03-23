import { objectHas, objectSet } from '../object';

describe('object utils', () => {
  let obj;

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: {
            d: 'd',
          },
          c1: 'c1',
        },
        b1: 'b1',
      },
      a1: 'a1',
    };
  });

  describe('objectHas function', () => {
    it('should check if the obj has path as string', () => {
      expect(objectHas(obj, 'a.b.c')).toBeTruthy();
      expect(objectHas(obj, 'a.b.c1')).toBeTruthy();
      expect(objectHas(obj, 'a.b.c.d')).toBeTruthy();
      expect(objectHas(obj, 'a.b.c1.d')).toBeFalsy();
    });

    it('should check if the obj has path as array', () => {
      expect(objectHas(obj, ['a', 'b', 'c'])).toBeTruthy();
      expect(objectHas(obj, ['a', 'b', 'c1'])).toBeTruthy();
      expect(objectHas(obj, ['a', 'b', 'c', 'd'])).toBeTruthy();
      expect(objectHas(obj, ['a', 'b', 'c1', 'd'])).toBeFalsy();
    });
  });

  describe('objectSet function', () => {
    it('should set value by path as string', () => {
      expect(objectHas(obj, 'a.b.c1.d')).toBeFalsy();
      objectSet(obj, 'a.b.c1', { d: 'd' });
      expect(objectHas(obj, 'a.b.c1.d')).toBeTruthy();
    });

    it('should set value by path as array', () => {
      expect(objectHas(obj, ['a', 'b', 'c1', 'd'])).toBeFalsy();
      objectSet(obj, ['a', 'b', 'c1'], { d: 'd' });
      expect(objectHas(obj, ['a', 'b', 'c1', 'd'])).toBeTruthy();
    });
  });
});
