import { IS_BROWSER } from '../utils/';
import { IMenuItem } from './MenuStore';
import { OperationModel } from './models';

import Worker from './SearchWorker.worker';

let worker: new () => Worker;

if (IS_BROWSER) {
  try {
    // tslint:disable-next-line
    worker = require('workerize-loader?inline&fallback=false!./SearchWorker.worker');
  } catch (e) {
    worker = require('./SearchWorker.worker').default;
  }
} else {
  worker = require('./SearchWorker.worker').default;
}

export class SearchStore<T> {
  searchWorker = new worker();

  indexItems(groups: Array<IMenuItem | OperationModel>) {
    groups.forEach(group => {
      if (group.type !== 'group') {
        // @ts-ignore
        this.add(group.name, group.description || '', group.id);
      }
    });

    this.searchWorker.done();
  }

  add(title: string, body: string, meta?: T) {
    this.searchWorker.add(title, body, meta);
  }

  search(q: string) {
    return this.searchWorker.search<T>(q);
  }

  async toJS() {
    return this.searchWorker.toJS();
  }

  load(state: any) {
    this.searchWorker.load(state);
  }
}
