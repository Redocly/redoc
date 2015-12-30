'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, View, ViewMetadata, provide} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';

import {
  TestComponentBuilder,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  it
} from 'angular2/testing';

import Redoc from 'lib/components/Redoc/redoc';
import SchemaManager from 'lib/utils/SchemaManager';
import OptionsManager from 'lib/options';

let optsMgr = new OptionsManager();

describe('Redoc components', () => {
  describe('Redoc Component', () => {
    let builder;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(BrowserDomAdapter, {useValue: new BrowserDomAdapter()}),
        provide(OptionsManager, {useValue: optsMgr})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/extended-petstore.json').then(() => null, (err) => { throw err; });
    }));


    it('should init component', (done) => {
      builder.createAsync(TestApp).then(fixture => {
        let component = getChildDebugElement(fixture.debugElement, 'redoc').componentInstance;
        expect(component).not.toBeNull();
        fixture.destroy();
        done();
      }, err => done.fail(err));
    });

    it('should init components tree without errors', (done) => {
      builder.createAsync(TestApp).then(fixture => {
        (() => fixture.detectChanges()).should.not.throw();
        fixture.destroy();
        done();
      }, err => done.fail(err));
    });

    describe('Options', () => {
      let component;
      let fixture;

      function build(tmpl, cb) {
        builder = builder.overrideView(TestApp,
          new ViewMetadata({template: tmpl, directives: [Redoc]}));
        builder.createAsync(TestApp).then(_fixture => {
          fixture = _fixture;
          component = getChildDebugElement(fixture.debugElement, 'redoc').componentInstance;
          fixture.detectChanges();
          cb();
        }, err => cb(err));
      }

      afterEach(() => {
        fixture.destroy();
      });

      it('should parse numeric scrollYOffset', (done) => {
        build(`<redoc scroll-y-offset="50"></redoc>`, err => {
          if (err) return done.fail(err);
          component.options.scrollYOffset().should.be.equal(50);
          done();
        });
      });

      it('should parse selector scrollYOffset', (done) => {
        build(`<div id="test" style="position: fixed; height: 50px; top:0"> </div>
              <redoc scroll-y-offset="#test"></redoc>`, err => {
          if (err) return done.fail(err);
          component.options.scrollYOffset().should.be.equal(50);
          done();
        });
      });

      it('should return 0 for incorrect selector scrollYOffset', (done) => {
        build(`<div id="test" style="position: fixed; height: 50px; top:0"> </div>
              <redoc scroll-y-offset="#test2"></redoc>`, err => {
          if (err) return done.fail(err);
          component.options.scrollYOffset().should.be.equal(0);
          done();
        });
      });

      it('should handle function scrollYOffset', (done) => {
        optsMgr.options.scrollYOffset = () => 123;
        build(`<redoc></redoc>`, err => {
          if (err) return done.fail(err);
          component.options.scrollYOffset().should.be.equal(123);
          optsMgr.options.scrollYOffset = 0;
          done();
        });
      });
    });
  });
});

describe('Redoc init', () => {
  it('should return promise', () => {
    let res = Redoc.init();
    res.should.be.instanceof(Promise);
  });

  it('should reject promise for not specifed url', (done) => {
    let res = Redoc.init();
    res.then(() => { done.fail('Should not been called'); }, () => {
      done();
    });
  });

  //skip because of PhantomJS crashes on this testcase
  xit('should init redoc', (done) => {
    var node = document.createElement('redoc');
    document.body.appendChild(node);
    let res = Redoc.init('/tests/schemas/extended-petstore.json');
    res.then(() => { done(); }, () => {
      done.fail('Error handler should not been called');
    });
  });
});


/** Test component that contains a Redoc. */
@Component({selector: 'test-app'})
@View({
  directives: [Redoc],
  template:
      `<redoc></redoc>`
})
class TestApp {
}
