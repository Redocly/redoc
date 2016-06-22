'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component, provide, ComponentRef } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

import {
  inject,
  async,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { Redoc } from './redoc';
import { SpecManager } from '../../utils/SpecManager';
import { OptionsService } from '../../services/index';

let optsMgr:OptionsService;

describe('Redoc components', () => {
  describe('Redoc Component', () => {
    let builder;
    let schemaMgr;
    beforeEachProviders(() => [
        provide(SpecManager, {useValue: new SpecManager()}),
    ]);
    beforeEach(async(inject([TestComponentBuilder, SpecManager, OptionsService],
      (tcb, _schemaMgr, _optsMgr) => {
      optsMgr = _optsMgr;
      builder = tcb;
      schemaMgr = _schemaMgr;
    })));

    beforeEach((done) => {
      return schemaMgr.load('/tests/schemas/extended-petstore.yml')
        .then(() => done())
        .catch(err => done.fail(err));
    });


    it('should init component', (done) => {
      builder.createAsync(TestAppComponent).then(fixture => {
        let component = getChildDebugElement(fixture.debugElement, 'redoc').componentInstance;
        expect(component).not.toBeNull();
        fixture.destroy();
        done();
      }, err => done.fail(err));
    });

    it('should init components tree without errors', (done) => {
      builder.createAsync(TestAppComponent).then(fixture => {
        (() => fixture.detectChanges()).should.not.throw();
        fixture.destroy();
        done();
      }, err => {
        return done.fail(err);
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

    it('should hide loading animation and display message in case of error', async(() => {
      spyOn(Redoc, 'hideLoadingAnimation').and.callThrough();
      spyOn(Redoc, 'displayError').and.callThrough();
      let res = Redoc.init();
      return res.then(() => {
        expect(Redoc.hideLoadingAnimation).toHaveBeenCalled();
        expect(Redoc.displayError).toHaveBeenCalled();
      });
    }));

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

  describe('Redoc destroy', () => {
    let builder;
    let fixture;
    let element;
    let destroySpy;
    let dom = new BrowserDomAdapter();
    beforeEachProviders(() => [
        provide(SpecManager, {useValue: new SpecManager()}),
        provide(BrowserDomAdapter, {useValue: new BrowserDomAdapter()}),
        provide(OptionsService, {useValue: optsMgr})
    ]);
    beforeEach(async(inject([TestComponentBuilder, SpecManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/methods-list-component.json');
    })));

    beforeEach((done) => {
      builder.createAsync(TestAppComponent).then(_fixture => {
        fixture = _fixture;
        element = getChildDebugElement(fixture.debugElement, 'methods-list').nativeElement;
        destroySpy = jasmine.createSpy('spy');
        Redoc.appRef = <ComponentRef<any>>{
          destroy: destroySpy
        };
        fixture.detectChanges();
        done();
      }, err => { throw err; });
    });

    afterEach(()=> {
      fixture.destroy();
      Redoc.appRef = null;
    });

    it('should call componentRef.destroy', () => {
      Redoc.destroy();
      expect(destroySpy).toHaveBeenCalled();
    });

    it('should create new host element', () => {
      element.parentElement.removeChild(element);
      Redoc.destroy();
      expect(dom.query('redoc')).not.toBeNull();
      dom.query('redoc').should.not.be.equal(element);
    });

    it('should set to null appRef', () => {
      Redoc.destroy();
      expect(Redoc.appRef).toBeNull();
    });
  });

  describe('Redoc autoInit', () => {
    const testURL = 'testurl';
    let dom = new BrowserDomAdapter();
    //let redocInitSpy;
    let elem: HTMLElement;

    beforeEach(() => {
      spyOn(Redoc, 'init').and.stub();
      elem = dom.createElement('redoc');
      dom.defaultDoc().body.appendChild(elem);
      dom.setAttribute(elem, 'spec-url', testURL);
    });

    it('should call Redoc.init with url from param spec-url', () => {
      Redoc.autoInit();
      expect(Redoc.init).toHaveBeenCalled();
      expect((<jasmine.Spy>Redoc.init).calls.argsFor(0)).toEqual([testURL]);
    });

    it('should not call Redoc.init when spec-url param is not provided', () => {
      dom.removeAttribute(elem, 'spec-url');
      Redoc.autoInit();
      expect(Redoc.init).not.toHaveBeenCalled();
    });

    afterEach(() => {
      (<jasmine.Spy>Redoc.init).and.callThrough();
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
class TestAppComponent {
}
