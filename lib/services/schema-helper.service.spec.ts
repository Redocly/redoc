'use strict';
import { SchemaHelper } from './schema-helper.service';
import { SpecManager } from '../utils/spec-manager';

describe('Spec Helper', () => {
  describe('injectors', () => {
    it('should autodetect type if not-specified', () => {
      spyOn(console, 'warn').and.stub();
      let schema = {
        type: undefined,
        properties: {}
      };

      SchemaHelper.runInjectors(schema, schema, '#/');
      schema.type.should.be.equal('object');
      expect(console.warn).toHaveBeenCalled();
      (<jasmine.Spy>console.warn).and.callThrough();
    });
  });
});
