import { IMenuItem } from './MenuStore';
import { OperationModel } from './models';

let worker;

if (typeof URL !== 'undefined') {
  try {
    // tslint:disable-next-line
    worker = require('workerize-loader?inline&fallback=false!./SearchWorker.worker').default;
  } catch (e) {
    worker = require('./SearchWorker.worker').default;
  }
} else {
  worker = require('./SearchWorker.worker').default;
}

export class SearchStore {
  searchWorker = new worker();

  indexItems(groups: Array<IMenuItem | OperationModel>) {
    const recurse = items => {
      items.forEach(group => {
        if (group.type !== 'group') {
          this.add(group.name, group.description || '', group.id);
        }
        recurse(group.items);
      });
    };

    recurse(groups);
    this.searchWorker.done();
  }

  add(title: string, body: string, ref: string) {
    this.searchWorker.add(title, body, ref);
  }

  search(q: string) {
    return this.searchWorker.search(q);
  }

  async toJS() {
    return this.searchWorker.toJS();
  }

  load(state: any) {
    this.searchWorker.load(state);
  }
}
