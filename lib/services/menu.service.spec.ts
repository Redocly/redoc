'use strict';
import { provide, Component } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import {
  inject,
  beforeEach,
  describe,
  beforeEachProviders,
  it,
  async
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { MenuService } from './menu.service';
import { Hash } from './hash.service';
import { ScrollService } from './scroll.service';
import { MethodsList } from '../components/index';
import { SpecManager } from '../utils/SpecManager';;

describe('Menu service', () => {
  let menu, hashService, scroll;
  let builder;
  let specMgr = new SpecManager();

  beforeEachProviders(() => [
    provide(BrowserDomAdapter, {useClass: BrowserDomAdapter}),
    provide(Hash, {useClass: Hash}),
    provide(ScrollService, {useClass: ScrollService}),
    provide(SpecManager, {useValue: new SpecManager()})
  ]);

  beforeEach(async(inject([Hash, ScrollService, TestComponentBuilder, SpecManager],
  (_hash, _scroll, tcb, _specMgr) => {
    hashService = _hash;
    scroll = _scroll;
    builder = tcb;
    specMgr = _specMgr;
  })));

  beforeEach(done => {
    specMgr.load('/tests/schemas/extended-petstore.yml').then(r => {
      done();
    }).catch(e => {
      done.fail(e);
    });
  });

  beforeEach(done => {
    menu = new MenuService(hashService, scroll, specMgr);
    builder.createAsync(TestAppComponent).then(fixture => {
      fixture.detectChanges();
      done();
    }).catch(err => done.fail(err) );
  });

  it('should run hashScroll when hash changed', (done) => {
    spyOn(menu, 'hashScroll').and.callThrough();
    hashService.changed.subscribe(() => {
      expect(menu.hashScroll).toHaveBeenCalled();
      menu.hashScroll.and.callThrough();
      done();
    });
    hashService.changed.next();
  });

  it('should scroll to method when location hash is present [jp]', (done) => {
    let hash = '#tag/pet/paths/~1pet~1findByStatus/get';
    spyOn(menu, 'hashScroll').and.callThrough();
    spyOn(window, 'scrollTo').and.stub();
    hashService.changed.subscribe(() => {
      expect(menu.hashScroll).toHaveBeenCalled();
      let scrollY = (<jasmine.Spy>window.scrollTo).calls.argsFor(0)[1];
      expect(scrollY).toBeGreaterThan(0);
      (<jasmine.Spy>window.scrollTo).and.callThrough();
      done();
    });
    hashService.changed.next(hash);
  });

  it('should scroll to method when location hash is present [operation]', (done) => {
    let hash = '#operation/getPetById';
    spyOn(menu, 'hashScroll').and.callThrough();
    spyOn(window, 'scrollTo').and.stub();
    hashService.changed.subscribe(() => {
      expect(menu.hashScroll).toHaveBeenCalled();
      let scrollY = (<jasmine.Spy>window.scrollTo).calls.argsFor(0)[1];
      expect(scrollY).toBeGreaterThan(0);
      done();
    });
    hashService.changed.next(hash);
  });

  it('should select next/prev menu item when scrolled down/up', () => {
    scroll.$scrollParent = document.querySelector('#parent');
    menu.activeCatIdx.should.be.equal(0);
    menu.activeMethodIdx.should.be.equal(-1);
    let elTop = menu.getCurrentMethodEl().getBoundingClientRect().bottom;

    scroll.$scrollParent.scrollTop = elTop + 1;

    //simulate scroll down
    spyOn(scroll, 'scrollY').and.returnValue(elTop + 2);
    menu.scrollUpdate(true);
    menu.activeCatIdx.should.be.equal(1);

    scroll.scrollY.and.returnValue(elTop - 2);
    scroll.$scrollParent.scrollTop = elTop - 1;
    menu.scrollUpdate(false);
    menu.activeCatIdx.should.be.equal(0);
  });
});

@Component({
  selector: 'test-app',
  directives: [ MethodsList ],
  template:
      `<div id='parent' style='height: 500px; overflow:auto'>
        <methods-list></methods-list>
      </div>`
})
class TestAppComponent {
}
