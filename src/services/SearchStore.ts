import { chain } from 'lodash';
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
    const recurse = items => {
      items.forEach(group => {
        if (group.type !== 'group') {
          this.add(group.name, group.description || '', group.id);
          if (group.type === 'operation') {
            const addDeepFields = (arr, duplicates) => {
              arr.forEach(field => {
                if (field.schema.fields !== undefined) { addDeepFields(field.schema.fields, duplicates); }
                if (field.schema.items !== undefined && field.schema.items.fields !== undefined) { addDeepFields(field.schema.items.fields, duplicates); }
                if (!duplicates.includes(field.name)) {
                  this.add(field.name, field.description || '', group.id);
                  duplicates.push(field.name);
                }
              });
            };

            if (group.responses !== undefined) {
              let responses = group.responses;
              const headers = chain(responses).flatMap('headers').compact().value();
              addDeepFields(headers, []);
              responses = chain(responses).flatMap('content').flatMap('mediaTypes').flatMap('schema').flatMap('fields').compact().value();
              addDeepFields(responses, []);
            }

            if (group.parameters !== undefined) {
              const parameters = group.parameters;
              addDeepFields(parameters, []);
            }

            if (group.requestBody !== undefined) {
              const body = group.requestBody;
              let bodies = chain(body.content.mediaTypes).flatMap('schema').flatMap('fields').value();
              if (bodies[0] === undefined) { bodies = chain(body.content.mediaTypes).flatMap('schema').flatMap('oneOf').flatMap('fields').compact().value(); }
              addDeepFields(bodies, []);
            }
          }
        }
        recurse(group.items);
      });
    };

    recurse(groups);
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
