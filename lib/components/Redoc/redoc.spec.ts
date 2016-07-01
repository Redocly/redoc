'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component, ComponentRef } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

import {
  inject,
  async
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { Redoc } from './redoc';
import { SpecManager } from '../../utils/SpecManager';
import { OptionsService } from '../../services/index';

let optsMgr:OptionsService;

describe('Redoc components', () => {
  describe('Redoc Component', () => {
    let builder;
    let specMgr;

    beforeEach(async(inject([TestComponentBuilder, SpecManager, OptionsService],
      (tcb, _specMgr, _optsMgr) => {
      optsMgr = _optsMgr;
      builder = tcb;
      specMgr = _specMgr;
      return specMgr.load('/tests/schemas/extended-petstore.yml');
    })));


    it('should init component', () => {
      let fixture = builder.createSync(TestAppComponent);
      let component = getChildDebugElement(fixture.debugElement, 'redoc').componentInstance;
      expect(component).not.toBeNull();
      fixture.destroy();
    });

    it('should init components tree without errors', () => {
      let fixture = builder.createSync(TestAppComponent);
      (() => fixture.detectChanges()).should.not.throw();
      fixture.destroy();
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
      let res = Redoc.init().catch(() => {/**/});
      res.should.be.instanceof(Promise);
    });

    it('should hide loading animation and display message in case of error', async(() => {
      spyOn(Redoc, 'hideLoadingAnimation').and.callThrough();
      spyOn(Redoc, 'displayError').and.callThrough();
      let res = Redoc.init();
      return res.catch(() => {
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
    let dom;
    let destroySpy;

    beforeEach(async(inject([TestComponentBuilder, SpecManager, OptionsService, BrowserDomAdapter],
      (tcb, specMgr, opts, _dom) => {
      builder = tcb;
      optsMgr = opts;
      dom = _dom;
      return specMgr.load('/tests/schemas/methods-list-component.json');
    })));

    beforeEach(() => {
      fixture = builder.createSync(TestAppComponent);
      element = getChildDebugElement(fixture.debugElement, 'methods-list').nativeElement;
      destroySpy = jasmine.createSpy('spy');
      Redoc.appRef = <ComponentRef<any>>{
        destroy: destroySpy
      };
      fixture.detectChanges();
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
