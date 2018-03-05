import { IMenuItem } from './MenuStore';
import { OperationModel } from './models';
import worker from './SearchWorker.worker';

export class SearchStore {
  searchWorker = new worker();

  indexItems(groups: Array<IMenuItem | OperationModel>) {
    groups.forEach(group => {
      if (group.type !== 'group') {
        this.add(group.name, group.description || '', group.id);
      }
      this.indexItems(group.items);
    });
  }

  add(title: string, body: string, ref: string) {
    this.searchWorker.add(title, body, ref);
  }

  done() {
    this.searchWorker.done();
  }

  search(q: string) {
    return this.searchWorker.search(q);
  }
}
