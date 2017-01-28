'use strict';
import { OnInit, OnDestroy } from '@angular/core';
import { SpecManager } from '../utils/spec-manager';
import { AppStateService } from '../services/app-state.service';
import { Subscription } from 'rxjs/Subscription';

export { SpecManager };

/**
 * Generic Component
 * @class
 */
export class BaseComponent implements OnInit, OnDestroy {
  pointer: string;
  componentSchema: any = null;
  dereferencedCache = {};

  constructor(public specMgr: SpecManager) {
  }

  /**
   * onInit method is run by angular2 after all component inputs are resolved
   */
  ngOnInit() {
    this.preinit();
  }

  preinit() {
    this.componentSchema = this.specMgr.byPointer(this.pointer || '');
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   * Used to initialize component
   * @abstract
   */
  init() {
    // empty
  }

  /**
   + Used to destroy component
   * @abstract
   */
  destroy() {
    // emtpy
  }
}

export class BaseSearchableComponent extends BaseComponent {
  searchSubscription: Subscription;
  constructor(public specMgr: SpecManager, public app: AppStateService) {
    super(specMgr);
  }

  subscribeForSearch() {
    this.searchSubscription = this.app.searchContainingPointers.subscribe(ptrs => {
      for (let i = 0; i < ptrs.length; ++i) {
        this.ensureSearchIsShown(ptrs[i]);
      }
    });
  }

  preinit() {
    super.preinit();
    this.subscribeForSearch();
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  /**
   + Used to destroy component
   * @abstract
   */
  ensureSearchIsShown(ptr: string) {
    // empy
  }
}
