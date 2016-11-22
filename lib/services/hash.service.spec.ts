'use strict';
import {
  inject
} from '@angular/core/testing';

import { Hash } from './hash.service';
import { SpecManager } from '../utils/spec-manager';

describe('Hash Service', () => {
  let specMgr = new SpecManager();
  let hashService;

  beforeEach(inject([Hash], (_hash) => hashService = _hash));

  it('should trigger changed event after ReDoc bootstrapped', (done) => {
    spyOn(hashService.value, 'next').and.stub();
    specMgr.spec.next({});
    setTimeout(() => {
      expect(hashService.value.next).toHaveBeenCalled();
      hashService.value.next.and.callThrough();
      done();
    });
  });
});
