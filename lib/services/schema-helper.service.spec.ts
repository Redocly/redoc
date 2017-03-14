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

      it('should show range as non-empty for minLength == 1', () => {
        let schema:any = {
          type: 'string',
          minLength: 1
        };

        SchemaHelper.runInjectors(schema, schema, '#/');
        schema._range.should.be.equal('non-empty');
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

  describe('moveRequiredPropsFirst', () => {
    it('should move required props to the top', () => {
      let props = [{
        name: 'prop2',
        type: 'string'
      },
      {
        name: 'prop1',
        type: 'number',
        _required: true
      }];

      let required = ['prop1'];

      SchemaHelper.moveRequiredPropsFirst(props, required);
      props[0].name.should.be.equal('prop1');
      props[1].name.should.be.equal('prop2');
    });

    it('should sort required props by the order or required', () => {
      var props = [{
        name: 'prop2',
        type: 'string'
      },
      {
        name: 'prop1',
        type: 'number',
        _required: true
      },
      {
        name: 'prop3',
        type: 'number',
        _required: true
      }
    ];

      let required = ['prop3', 'prop1'];

      SchemaHelper.moveRequiredPropsFirst(props, required);
      props[0].name.should.be.equal('prop3');
      props[1].name.should.be.equal('prop1');
      props[2].name.should.be.equal('prop2');
    });
  });
});
