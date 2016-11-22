'use strict';

import {
  Directive,
  Input,
  TemplateRef,
  ChangeDetectorRef,
  ViewContainerRef,
  Injectable,
  NgZone
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ScrollService } from '../../../services/scroll.service';
import { OptionsService } from '../../../services/options.service';

import { isSafari } from '../../../utils/helpers';

export class LazyForRow {
  constructor(public $implicit: any, public index: number, public show: boolean) {}

  get first(): boolean { return this.index === 0; }

  get even(): boolean { return this.index % 2 === 0; }

  get odd(): boolean { return !this.even; }
}

@Injectable()
export class LazyTasksService {
  private _tasks = [];
  private _current: number = 0;
  private _syncCount: number = 0;
  public loadProgress = new BehaviorSubject<number>(0);
  public allSync = false;
  constructor(public optionsService: OptionsService, private zone: NgZone) {
  }

  get empty() {
    return this._current === this._tasks.length - 1;
  }
  set syncCount(n: number) {
    this._syncCount = n;
  }

  addTasks(tasks:any[], callback:Function) {
    tasks.forEach((task) => {
      let taskCopy = Object.assign({_callback: callback}, task);
      this._tasks.push(taskCopy);
    });
  }

  nextTaskSync() {
    this.zone.runOutsideAngular(() => {
      let task = this._tasks[this._current];
      if (!task) return;
      task._callback(task.idx, true);
      this._current++;
      this.loadProgress.next(this._current / this._tasks.length * 100);
    });
  }

  nextTask() {
    requestAnimationFrame(() => {
      let task = this._tasks[this._current];
      if (!task) return;
      task._callback(task.idx, false).then(() => {
        this._current++;

        setTimeout(()=> this.nextTask());
        this.loadProgress.next(this._current / this._tasks.length * 100);
      });
    });
  }

  sortTasks(catIdx, metIdx) {
    let idxMap = {};
    this._tasks.forEach((task, idx) => {
      idxMap[task.catIdx + '_' +  task.idx] = idx;
    });
    metIdx  = metIdx < 0 ? 0 : metIdx;
    let destIdx = idxMap[catIdx + '_' + metIdx] || 0;
    this._tasks.sort((a, b) => {
      let aIdx = idxMap[a.catIdx + '_' +  a.idx];
      let bIdx = idxMap[b.catIdx + '_' +  b.idx];
      return Math.abs(aIdx - destIdx) - Math.abs(bIdx - destIdx);
    })
  }

  start(catIdx, metIdx) {
    let syncCount = 5;
    // I know this is bad practice to detect browsers but there is an issue on Safari only
    // http://stackoverflow.com/questions/40692365/maintaining-scroll-position-while-inserting-elements-above-glitching-only-in-sa
    if (isSafari && this.optionsService.options.$scrollParent === window) {
      syncCount = (metIdx >= 0) ?
          this._tasks.findIndex(task => (task.catIdx === catIdx) && (task.idx === metIdx))
        : this._tasks.findIndex(task => task.catIdx === catIdx);
      syncCount += 1;
    } else {
      this.sortTasks(catIdx, metIdx);
    }
    if (this.allSync) syncCount = this._tasks.length;
    for (var i=0; i < syncCount; i++) {
      this.nextTaskSync();
    }
    this.nextTask();
  }
}


@Directive({
  selector: '[lazyFor][lazyForOf]'
})
export class LazyFor {
  @Input() lazyForOf: any;

  prevIdx = null;

  private _viewRef;
  constructor(
    public _template: TemplateRef<LazyForRow>,
    public cdr: ChangeDetectorRef,
    public _viewContainer: ViewContainerRef,
    public lazyTasks: LazyTasksService,
    public scroll: ScrollService
  ){
  }

  nextIteration(idx: number, sync: boolean):Promise<void> {
    const view = this._viewContainer.createEmbeddedView(
                this._template, new LazyForRow(this.lazyForOf[idx], idx, sync), idx < this.prevIdx ? 0 : undefined);
    this.prevIdx = idx;
    view.context.index = idx;
    (<any>view as ChangeDetectorRef).markForCheck();
    (<any>view as ChangeDetectorRef).detectChanges();
    if (sync) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      requestAnimationFrame(() => {
        this.scroll.saveScroll();

        view.context.show = true;
        (<any>view as ChangeDetectorRef).markForCheck();
        (<any>view as ChangeDetectorRef).detectChanges();

        this.scroll.restoreScroll();
        resolve();
      });
    });
  }

  ngOnInit() {
    this.lazyTasks.addTasks(this.lazyForOf, this.nextIteration.bind(this))
  }
}
