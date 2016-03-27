'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, ViewMetadata, provide} from 'angular2/core';
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
      return schemaMgr.load('/tests/schemas/extended-petstore.yml').then(() => null, (err) => { throw err; });
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

  describe('Redoc init', () => {
    let dom = new BrowserDomAdapter();
    let elem;
    beforeEach(() => {
      elem = dom.createElement('redoc');
      dom.defaultDoc().body.appendChild(elem);
    });

    afterEach(() => {
      dom.defaultDoc().body.removeChild(elem);
    });

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
      let res = Redoc.init('/tests/schemas/extended-petstore.yml');
      res.then(() => { done(); }, () => {
        done.fail('Error handler should not been called');
      });
    });
  });

  describe('Redoc dispose', () => {
    let builder;
    let fixture;
    let element;
    let disposeSpy;
    let dom = new BrowserDomAdapter();
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(BrowserDomAdapter, {useValue: new BrowserDomAdapter()}),
        provide(OptionsManager, {useValue: optsMgr})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/methods-list-component.json').then(() => null, (err) => { throw err; });
    }));

    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        element = getChildDebugElement(fixture.debugElement, 'methods-list').nativeElement;
        disposeSpy = jasmine.createSpy('spy');
        Redoc.appRef = {
          dispose: disposeSpy
        };
        fixture.detectChanges();
        done();
      }, err => { throw err; });
    });

    afterEach(()=> {
      fixture.destroy();
      Redoc.appRef = null;
    });

    it('should call componentRef.dispose', () => {
      Redoc.dispose();
      expect(disposeSpy).toHaveBeenCalled();
    });

    it('should create new host element', () => {
      element.parentElement.removeChild(element);
      Redoc.dispose();
      expect(dom.query('redoc')).not.toBeNull();
      dom.query('redoc').should.not.be.equal(element);
    });

    it('should set to null appRef', () => {
      Redoc.dispose();
      expect(Redoc.appRef).toBeNull();
    });
  });

  describe('Redoc autoInit', () => {
    const testURL = 'testurl';
    let dom = new BrowserDomAdapter();
    let elem;
    beforeEach(() => {
      spyOn(Redoc, 'init').and.stub();
      elem = dom.createElement('redoc');
      dom.defaultDoc().body.appendChild(elem);
      dom.setAttribute(elem, 'spec-url', testURL);
    });

    it('should call Redoc.init with url from param spec-url', () => {
      Redoc.autoInit();
      expect(Redoc.init).toHaveBeenCalled();
      expect(Redoc.init.calls.argsFor(0)).toEqual([testURL]);
    });

    it('should not call Redoc.init when spec-url param is not provided', () => {
      dom.removeAttribute(elem, 'spec-url');
      Redoc.autoInit();
      expect(Redoc.init).not.toHaveBeenCalled();
    });

    afterEach(() => {
      Redoc.init.and.callThrough();
      dom.defaultDoc().body.removeChild(elem);
    });
  });
});

/** Test component that contains a Redoc. */
@Component({
  selector: 'test-app',
  directives: [Redoc],
  template:
      `<redoc disable-lazy-schemas></redoc>`
})
class TestApp {
}
