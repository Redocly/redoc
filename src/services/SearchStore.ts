import { SpecStore } from '../index';
import { GroupModel, OperationModel } from './models';
import worker from './SearchWorker.worker';

export class SearchStore {
  searchWorker = new worker();

  constructor(private spec: SpecStore) {
    this.indexGroups(this.spec.operationGroups);
    this.done();
  }

  indexGroups(groups: Array<GroupModel | OperationModel>) {
    groups.forEach(group => {
      if (group.type !== 'group') {
        this.add(group.name, group.description || '', group.id);
      }
      this.indexGroups(group.items);
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
