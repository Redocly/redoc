'use strict';

import { RedocEventsService } from './events.service';
import { Hash } from './hash.service';

describe('Hash Service', () => {
  let events = new RedocEventsService();
  let hashService;

  beforeEach(() => {
    hashService = new Hash(events);
  });

  afterEach(() => {
    hashService.unbind();
  });

  it('should trigger changed event after ReDoc bootstrapped', (done) => {
    spyOn(hashService.changed, 'next').and.callThrough();
    events.bootstrapped.next({});
    setTimeout(() => {
      expect(hashService.changed.next).toHaveBeenCalled();
      done();
    });
  });
});
