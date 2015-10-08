'use strict';
import SwaggerParser from 'swagger-parser';
import JsonPointer from './JsonPointer'

export class SchemaManager {
  constructor() {
    if (SchemaManager.prototype._instance) {
      return SchemaManager.prototype._instance;
    }

    SchemaManager.prototype._instance = this;

    this._schema = {};
  }

  static instance() {
    return new SchemaManager();
  }

  load(url) {
    let promise = new Promise((resolve, reject) => {
      this._schema = {};

      SwaggerParser.bundle(url)
        .then(
          (schema) => {
            this._schema = schema;
            resolve(this._schema);
          },
          (err) => reject(err)
        );
    });

    return promise;
  }

  get schema() {
    // TODO: consider returning promise
    return this._schema;
  }

  byPointer(pointer) {
    return JsonPointer.get(this._schema, pointer);
  }

}
