'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';

import { EndpointLink } from './endpoint-link';
import { SpecManager } from '../../utils/spec-manager';

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });
  describe('EndpointLink Component', () => {
    let builder;
    let component: EndpointLink;
    let specMgr: SpecManager;

    beforeEach(async(inject([SpecManager], (_specMgr) => {
      specMgr = _specMgr;
    })));

    beforeEach(() => {
      specMgr.apiUrl = 'http://test.com/v1';
      specMgr._schema = {
        info: {},
        host: 'petstore.swagger.io',
        baseName: '/v2',
        schemes: ['https', 'http'],
        'x-servers': [
          {
            url: '//test.com/v2'
          },
          {
            url: 'ws://test.com/v3',
            description: 'test'
          }
        ]
      };
      specMgr.init();

      component = new EndpointLink(specMgr);
    });

    it('should replace // with appropriate protocol', () => {
      component.ngOnInit();
      component.servers[0].url.should.be.equal('https://test.com/v2');
    });


    it('should preserve other protocols', () => {
      component.ngOnInit();
      component.servers[1].url.should.be.equal('ws://test.com/v3');
    });

    it('should fallback to host + basePath + schemas if no x-servers', () => {
      specMgr._schema['x-servers'] = null;
      specMgr.init();
      component.ngOnInit();
      component.servers.should.be.lengthOf(1);
      component.servers[0].url.should.be.equal('https://petstore.swagger.io');
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  template:
      `<method pointer='#/paths/~1user~1{username}/put'></method>`
})
class TestAppComponent {
}
