'use strict';
import { Component  } from '@angular/core';
import {
  inject,
  TestBed
} from '@angular/core/testing';

import { MethodsList } from '../components/MethodsList/methods-list';
import { MenuService, MenuItem } from './menu.service';
import { Hash } from './hash.service';
import { LazyTasksService } from '../shared/components/LazyFor/lazy-for';
import { ScrollService  } from './scroll.service';
import { SchemaHelper } from './schema-helper.service';
import { SpecManager } from '../utils/spec-manager';;

describe('Menu service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent, MethodsList ] });
  });

  let menu:MenuService, hashService, scroll, tasks;
  let specMgr;

  beforeEach(inject([SpecManager, Hash, ScrollService, LazyTasksService],
  ( _specMgr, _hash, _scroll, _tasks) => {
    hashService = _hash;
    scroll = _scroll;
    tasks = _tasks;
    specMgr = _specMgr;
    SchemaHelper.setSpecManager(specMgr);
  }));

  beforeEach(done => {
    specMgr.load('/tests/schemas/extended-petstore.yml').then(done, done.fail);
  });

  beforeEach(() => {
    menu = TestBed.get(MenuService);
    let fixture = TestBed.createComponent(TestAppComponent);
    fixture.detectChanges();
  });

  it('should scroll to method when location hash is present [jp]', (done) => {
    let hash = '#tag/pet/paths/~1pet~1findByStatus/get';
    spyOn(menu, 'scrollToActive').and.callThrough();
    spyOn(window, 'scrollTo').and.stub();
    hashService.value.subscribe((hash) => {
      if (!hash) return;
      expect(menu.scrollToActive).toHaveBeenCalled();
      let scrollY = (<jasmine.Spy>window.scrollTo).calls.argsFor(0)[1];
      expect(scrollY).toBeGreaterThan(0);
      (<jasmine.Spy>window.scrollTo).and.callThrough();
      done();
    });
    hashService.value.next(hash);
  });
  //
  it('should scroll to method when location hash is present [operation]', (done) => {
    let hash = '#operation/getPetById';
    spyOn(menu, 'scrollToActive').and.callThrough();
    spyOn(window, 'scrollTo').and.stub();
    hashService.value.subscribe((hash) => {
      if (!hash) return;
      expect(menu.scrollToActive).toHaveBeenCalled();
      let scrollY = (<jasmine.Spy>window.scrollTo).calls.argsFor(0)[1];
      expect(scrollY).toBeGreaterThan(0);
      done();
    });
    hashService.value.next(hash);
  });

  it('should select next/prev menu item when scrolled down/up', () => {
    // enable all items
    menu.items.forEach(item => item.ready = true);

    scroll.$scrollParent = document.querySelector('#parent');
    menu.activeIdx.should.be.equal(-1);

    let nextElTop = menu.getEl(1).getBoundingClientRect().top;
    scroll.$scrollParent.scrollTop = nextElTop + 1;

    //simulate scroll down
    spyOn(scroll, 'scrollY').and.returnValue(nextElTop + 10);
    menu.onScroll(true);
    menu.activeIdx.should.be.equal(1);

    scroll.scrollY.and.returnValue(nextElTop - 2);
    scroll.$scrollParent.scrollTop = nextElTop - 1;
    menu.onScroll(false);
    menu.activeIdx.should.be.equal(0);
  });

  describe('buildMenu method', () => {
    let suitSchema = {
      tags: [
        {name: 'tag1', description: 'info1', 'x-traitTag': true},
        {name: 'tag2', description: 'info2'},
        {name: 'tag4', description: 'info2', 'x-displayName': 'Tag Four'}
      ],
      paths: {
        test: {
          put: {
            tags: ['tag1', 'tag3'],
            summary: 'test put'
          },
          get: {
            tags: ['tag1', 'tag2'],
            summary: 'test get'
          },
          delete: {
            tags: ['tag4'],
            summary: 'test delete'
          },
          // no tags
          post: {
            summary: 'test post'
          }
        }
      }
    };

    let items:MenuItem[];
    beforeEach(() => {
      menu.items = null;
      specMgr._schema = suitSchema;
      menu.buildMenu();
      items = menu.items;
    });

    it('should return instance of Array', () => {
      items.should.be.instanceof(Array);
    });

    it('should return Array with correct number of items', () => {
      // 3 - defined tags, 1 - tag3 and 1 method item for method without tag
      items.length.should.be.equal(3 + 1 + 1);
    });

    it('should append not defined tags to the end of list', () => {
      let item = items[3];
      item.name.should.be.equal('tag3');
      item.items.length.should.be.equal(1);
      item.items[0].name.should.be.equal('test put');
    });

    it('should append method items without tags to the end of list', () => {
      let methodItem = items[4];
      methodItem.name.should.be.equal('test post');
      methodItem.metadata.type.should.be.equal('method');
      should.not.exist(methodItem.items);
    });

    it('should map x-traitTag to empty method list', () => {
      let item = items[0];
      should.not.exist(item.items);
    });

    it('methods for tag should contain valid pointer and name', () => {
      for (let item of items) {
        item.should.be.an.Object();
        if (item.items) {
          for (let subItem of item.items) {
            subItem.should.have.properties(['metadata']);
            let pointer = subItem.metadata.pointer;
            let methSchema = specMgr.byPointer(pointer);
            should.exist(methSchema);
            if (methSchema.summary) {
              methSchema.summary.should.be.equal(subItem.name);
            }
          }
        }
      }
    });

    it('should use x-displayName to set custom names', () => {
      let info = items[2];
      info.id.should.be.equal('tag/tag4');
      info.name.should.be.equal('Tag Four');
    });
  });
});

@Component({
  selector: 'test-app',
  template:
      `<div id='parent' style='height: 500px; overflow:auto'>
        <api-info></api-info>
        <methods-list></methods-list>
      </div>`
})
class TestAppComponent {
}
