import { IMenuItem } from './MenuStore';
import { OperationModel } from './models';
import worker from './SearchWorker.worker';

export class SearchStore {
  searchWorker = new worker();

  indexItems(groups: Array<IMenuItem | OperationModel>) {
    const recurse = groups => {
      groups.forEach(group => {
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
