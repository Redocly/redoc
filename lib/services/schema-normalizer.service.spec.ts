'use strict';
import { SchemaNormalizer } from './schema-normalizer.service';
import { SpecManager } from '../utils/spec-manager';
import { OptionsService } from '../services/options.service';


describe('Spec Helper', () => {
  let specMgr:SpecManager = new SpecManager(new OptionsService());
  let normalizer = new SchemaNormalizer(specMgr);

  describe('Dereference', () => {
    beforeAll(done => {
      specMgr.load('/tests/schemas/base-component-dereference.json').then(
        () => done()
      );
    });

    describe('simple dereference', () => {
      let resolved;
      let pointer;
      beforeAll(() => {
        pointer = '/paths/test1/get/parameters/0';
        resolved = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      it('should not contain $ref property', () => {
        expect(resolved.$ref).toBeUndefined();
      });

      it('should inject Title if not exist based on reference', () => {
        resolved.title.should.be.equal('Simple');
      });

      it('should inject pointer', () => {
        resolved._pointer.should.be.equal('#/definitions/Simple');
      });

      it('should insert correct definition instead of reference', () => {
        delete resolved.title;
        delete resolved._pointer;
        resolved.should.be.deepEqual(specMgr.schema.definitions.Simple);
      });
    });

    describe('nested dereference', () => {
      let resolved;
      beforeAll(() => {
        let pointer = '/paths/test2/get/parameters/0';
        resolved = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      it('should not touch title if exist', () => {
        resolved.title.should.be.equal('NesteTitle');
      });

      it('should resolve nested schema', () => {
        expect(resolved.properties.subschema.$ref).toBeUndefined();
        resolved._pointer.should.be.equal('#/definitions/Nested');
        resolved.properties.subschema._pointer.should.be.equal('#/definitions/Simple');
        resolved.properties.subschema.type.should.be.equal('object');
      });
    });

    describe('array schema dereference', () => {
      let resolved;
      beforeAll(() => {
        let pointer = '/paths/test3/get/parameters/0';
        resolved = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      it('should resolve array schema', () => {
        expect(resolved.$ref).toBeUndefined();
        expect(resolved.items.$ref).toBeUndefined();
        resolved.type.should.be.equal('array');
        resolved._pointer.should.be.equal('#/definitions/ArrayOfSimple');
        resolved.items._pointer.should.be.equal('#/definitions/Simple');
        resolved.items.type.should.be.equal('object');
      });
    });

    describe('circular dereference', () => {
      let resolved;
      beforeAll(() => {
        let pointer = '/paths/test4/get/parameters/0';
        resolved = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      it('should resolve circular schema', () => {
        expect(resolved.$ref).toBeUndefined();
        expect(resolved.items.$ref).toBeUndefined();
        resolved.type.should.be.equal('array');
        resolved._pointer.should.be.equal('#/definitions/Circular');
      });

      it('should remove _pointer when detect circularity', () => {
        expect(resolved.items._pointer).toBeUndefined();
        resolved.items.title.should.be.equal('Circular');
      });

      it('should resolve transitive circular ref', () => {
        let pointer = '/paths/test6/get/parameters/0';
        resolved = normalizer.normalize(specMgr.byPointer(pointer), pointer);
        expect(resolved.additionalProperties.$ref).toBeUndefined();
        expect(resolved.additionalProperties.items.additionalProperties.$ref).toBeUndefined();
        resolved.additionalProperties.type.should.be.equal('array');
        resolved.additionalProperties._pointer.should.be.equal('#/definitions/CircularTransitive2');
        expect(resolved.additionalProperties.items.additionalProperties._pointer).toBeUndefined();
        resolved.additionalProperties.items.additionalProperties.title.should.be.equal('CircularTransitive');
      });
    });

    describe('$ref with other fields on the same level', () => {
      let resolved;
      beforeAll(() => {
        let pointer = '/paths/test5/get/parameters/0';
        spyOn(console, 'warn').and.stub();
        resolved = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      afterAll(() => {
        (<jasmine.Spy>console.warn).and.callThrough();
      });

      it('should print warning to console', () => {
        expect(console.warn).toHaveBeenCalled();
      });

      it('should skip other fields', () => {
        expect(resolved.$ref).toBeUndefined();
        expect(resolved.title).toBeDefined();
        resolved.title.should.be.equal('Simple');
      });

      it('should preserve description field', () => {
        expect(resolved.$ref).toBeUndefined();
        expect(resolved.description).toBeDefined();
        resolved.description.should.be.equal('test');
      });
    });
  });

  describe('mergeAllOf', () => {
    beforeAll((done) => {
      specMgr.load('tests/schemas/base-component-joinallof.json').then(() => done());
    });

    describe('Simple allOf merge', () => {
      let joined;
      beforeAll(() => {
        let pointer = '/definitions/SimpleAllOf';
        joined = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      it('should remove $allOf field', () => {
        expect(joined.allOf).toBeUndefined();
      });

      it('should set type object', () => {
        joined.type.should.be.equal('object');
      });

      it('should merge properties', () => {
        Object.keys(joined.properties).length.should.be.equal(3);
        Object.keys(joined.properties).should.be.deepEqual(['prop1', 'prop2', 'prop3']);
      });

      it('should merge required', () => {
        joined.required.length.should.be.equal(2);
        joined.required.should.be.deepEqual(['prop1', 'prop3']);
      });
    });

    describe('AllOf with refrence', () => {
      let joined;
      beforeAll(() => {
        let pointer = '/definitions/AllOfWithRef';
        joined = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      it('should remove $allOf field', () => {
        expect(joined.allOf).toBeUndefined();
      });

      it('should set type object', () => {
        joined.type.should.be.equal('object');
      });

      it('should merge properties', () => {
        Object.keys(joined.properties).length.should.be.equal(2);
        Object.keys(joined.properties).should.be.deepEqual(['id', 'prop3']);
      });

      it('should merge required', () => {
        joined.required.length.should.be.equal(2);
        joined.required.should.be.deepEqual(['id', 'prop3']);
      });
    });

    describe('AllOf with other properties on the allOf level', () => {
      let joined;
      beforeAll(() => {
        let pointer = '/definitions/AllOfWithOther';
        joined = normalizer.normalize(specMgr.byPointer(pointer), pointer);
      });

      it('should remove $allOf field', () => {
        expect(joined.allOf).toBeUndefined();
      });

      it('should set type object', () => {
        joined.type.should.be.equal('object');
      });

      it('should merge properties', () => {
        Object.keys(joined.properties).length.should.be.equal(1);
        Object.keys(joined.properties).should.be.deepEqual(['id']);
      });

      it('should merge required', () => {
        joined.required.length.should.be.equal(1);
        joined.required.should.be.deepEqual(['id']);
      });

      it('should preserve parent properties', () => {
        joined.description.should.be.equal('Test');
        joined.readOnly.should.be.equal(true);
      });
    });

    describe('allOf edgecases', () => {
      it('should merge properties and required when defined on allOf level', () => {
        let pointer = '/definitions/PropertiesOnAllOfLevel';
        let joined;
        (() => joined = normalizer.normalize(specMgr.byPointer(pointer), pointer)).should.not.throw();
        Object.keys(joined.properties).length.should.be.equal(3);
      });

      it('should throw when merging schemas with different types', () => {
        let pointer = '/definitions/BadAllOf1';
        (() => normalizer.normalize(specMgr.byPointer(pointer), pointer)).should.throw();
      });

      it('should handle nested allOF', () => {
        let pointer = '/definitions/NestedAllOf';
        let joined;
        (() => joined = normalizer.normalize(specMgr.byPointer(pointer), pointer)).should.not.throw();
        Object.keys(joined.properties).length.should.be.equal(4);
        Object.keys(joined.properties).should.be.deepEqual(['prop1', 'prop2', 'prop3', 'prop4']);
        joined.required.should.be.deepEqual(['prop1', 'prop3']);
      });
    });

    xdescribe('Merge array allOf', () => {
      //emtpy
    });
  });
});
