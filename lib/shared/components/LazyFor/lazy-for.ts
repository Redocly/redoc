'use strict';

import {
  Directive,
  Input,
  TemplateRef,
  ChangeDetectorRef,
  ViewContainerRef,
  Injectable
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
  private menuService;

  public loadProgress = new BehaviorSubject<number>(0);
  public allSync = false;
  constructor(public optionsService: OptionsService) {
  }

  get empty() {
    return this._current === this._tasks.length;
  }

  set syncCount(n: number) {
    this._syncCount = n;
  }

  set lazy(sync:boolean) {
    this.allSync = sync;
  }

  addTasks(tasks:any[], callback:Function) {
    tasks.forEach((task, idx) => {
      let taskCopy = Object.assign({_callback: callback, idx: idx}, task);
      this._tasks.push(taskCopy);
    });
  }

  nextTaskSync() {
    let task = this._tasks[this._current];
    if (!task) return;
    task._callback(task.idx, true);
    this._current++;
    this.menuService.enableItem(task.flatIdx);
    this.loadProgress.next(this._current / this._tasks.length * 100);
  }

  nextTask() {
    requestAnimationFrame(() => {
      let task = this._tasks[this._current];
      if (!task) return;
      task._callback(task.idx, false).then(() => {
        this._current++;
        this.menuService.enableItem(task.flatIdx);
        setTimeout(()=> this.nextTask());
        this.loadProgress.next(this._current / this._tasks.length * 100);
      }).catch(err => console.error(err));
    });
  }

  sortTasks(center) {
    let idxMap = {};
    this._tasks.sort((a, b) => {
      return Math.abs(a.flatIdx - center) - Math.abs(b.flatIdx - center);
    })
  }

  start(idx, menuService) {
    this.menuService = menuService;
    let syncCount = 5;
    // I know this is a bad practice to detect browsers but there is an issue in Safari only
    // http://stackoverflow.com/questions/40692365/maintaining-scroll-position-while-inserting-elements-above-glitching-only-in-sa
    if (isSafari && this.optionsService.options.$scrollParent === window) {
      syncCount = this._tasks.findIndex(task => task.idx === idx);
      syncCount += 1;
    } else {
      this.sortTasks(idx);
    }
    if (this.allSync) syncCount = this._tasks.length;
    for (var i = this._current; i < syncCount; i++) {
      this.nextTaskSync();
    }
    this.nextTask();
  }
}

@Injectable()
export class LazyTasksServiceSync extends LazyTasksService {
  constructor(optionsService: OptionsService) {
    super(optionsService);
    this.allSync = true;
  }
}


@Directive({
  selector: '[lazyFor][lazyForOf]'
})
export class LazyFor {
  @Input() lazyForOf: any;

  prevIdx = null;

  constructor(
    public _template: TemplateRef<LazyForRow>,
    public cdr: ChangeDetectorRef,
    public _viewContainer: ViewContainerRef,
    public lazyTasks: LazyTasksService,
    public scroll: ScrollService
  ){
  }

  nextIteration(idx: number, sync: boolean):Promise<void> {
    const view = this._viewContainer.createEmbeddedView(this._template,
      new LazyForRow(this.lazyForOf[idx], idx, sync), idx < this.prevIdx ? 0 : undefined);
    this.prevIdx = idx;
    view.context.index = idx;
    (<any>view as ChangeDetectorRef).markForCheck();
    (<any>view as ChangeDetectorRef).detectChanges();
    if (sync) {
      return Promise.resolve();
    }
    return new Promise<void>(resolve => {
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
    if (!this.lazyForOf) return;
    this.lazyTasks.addTasks(this.lazyForOf, this.nextIteration.bind(this))
  }
}
