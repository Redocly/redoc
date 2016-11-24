'use strict';
import {
  inject
} from '@angular/core/testing';

import { Hash } from './hash.service';

describe('Hash Service', () => {
  let hashService;

  beforeEach(inject([Hash], (_hash) => {
    hashService = _hash;
  }));

  it('should trigger changed event when method start is called', () => {
    spyOn(hashService.value, 'next').and.stub();
    hashService.start();
    expect(hashService.value.next).toHaveBeenCalled();
    hashService.value.next.and.callThrough();
  });
});
