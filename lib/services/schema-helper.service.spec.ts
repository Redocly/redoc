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

    describe('string', () => {
      it('should calculate range for string with maxLength', () => {
        let schema:any = {
          type: 'string',
          maxLength: 3
        };

        SchemaHelper.runInjectors(schema, schema, '#/');
        schema._range.should.be.equal('<= 3 characters');
      });

      it('should calculate range for string with minLength', () => {
        let schema:any = {
          type: 'string',
          minLength: 3,
        };

        SchemaHelper.runInjectors(schema, schema, '#/');
        schema._range.should.be.equal('>= 3 characters');
      });

      it('should calculate range for string with both max and minLength', () => {
        let schema:any = {
          type: 'string',
          minLength: 3,
          maxLength: 5
        };

        SchemaHelper.runInjectors(schema, schema, '#/');
        schema._range.should.be.equal('[ 3 .. 5 ] characters');
      });

      it('should calculate range for string with equal max and minLength', () => {
        let schema:any = {
          type: 'string',
          minLength: 5,
          maxLength: 5
        };

        SchemaHelper.runInjectors(schema, schema, '#/');
        schema._range.should.be.equal('5 characters');
      });
    });
  });

  describe('preprocessProperties', () => {
    it('should not throw when type array and items are not defined', () => {
      let schema = {
        type: 'object',
        properties: {
          prop1: {
            type: 'array'
          }
        }
      };

      (() => SchemaHelper.preprocessProperties(schema, '#/', {})).should.not.throw();
    });
  });
});
