'use strict';
import { provide, Component } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import {
  inject,
  beforeEach,
  describe,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { OptionsService } from './options.service';
import { MenuService } from './menu.service';
import { Hash } from './hash.service';
import { ScrollService } from './scroll.service';
import { RedocEventsService } from './events.service';
import { MethodsList } from '../components/index';
import { SchemaManager } from '../utils/SchemaManager';;

describe('Menu service', () => {
  let menu, hashService, scroll;
  let builder;
  let schemaMgr;

  beforeEachProviders(() => [
      provide(BrowserDomAdapter, {useClass: BrowserDomAdapter}),
      provide(OptionsService, {useClass: OptionsService}),
      provide(Hash, {useClass: Hash}),
      provide(ScrollService, {useClass: ScrollService}),
      provide(RedocEventsService, {useClass: RedocEventsService}),
      provide(SchemaManager, {useClass: SchemaManager})
  ]);

  beforeEach(inject([Hash, ScrollService, SchemaManager, TestComponentBuilder],
    (_hash, _scroll, _schemaMgr, tcb) => {
    hashService = _hash;
    scroll = _scroll;
    schemaMgr = _schemaMgr;
    builder = tcb;
  }));


  beforeEach((done) => {
    schemaMgr.load('/tests/schemas/extended-petstore.yml').then(() => {
      menu = new MenuService(hashService, scroll, schemaMgr);
      done();
    }).catch((err) => done.fail(err));
  });

  beforeEach((done) => {
    builder.createAsync(TestAppComponent).then((fixture) => {
      fixture.detectChanges();
      done();
    }).catch((err) => done.fail(err));
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
