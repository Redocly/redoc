import { hasNestedFields } from '../hasNestedFields';
import type { SchemaModel, FieldModel } from '../../models/types';

const createMockField = (isPrimitive: boolean, isCircular: boolean = false): FieldModel => ({
  schema: {
    isPrimitive,
    isCircular,
  } as SchemaModel,
  name: 'mockField',
  required: false,
  description: 'Mock field',
  deprecated: false,
  kind: 'field',
  explode: false,
  deps: {} as any,
});

const createMockSchema = (fields?: FieldModel[], oneOf?: SchemaModel[]): SchemaModel =>
  ({
    fields,
    oneOf,
    isPrimitive: false,
    isCircular: false,
  }) as SchemaModel;

describe('hasNestedFields', () => {
  describe('when schema is undefined or null', () => {
    it('should return false for undefined schema', () => {
      expect(hasNestedFields(undefined)).toBe(false);
    });

    it('should return false for null schema', () => {
      expect(hasNestedFields(null as any)).toBe(false);
    });
  });

  describe('when schema has no fields', () => {
    it('should return false for schema with undefined fields', () => {
      const schema = createMockSchema();
      expect(hasNestedFields(schema)).toBe(false);
    });

    it('should return false for schema with empty fields array', () => {
      const schema = createMockSchema([]);
      expect(hasNestedFields(schema)).toBe(false);
    });
  });

  describe('when schema has only primitive fields', () => {
    it('should return false for schema with only primitive fields', () => {
      const primitiveField1 = createMockField(true);
      const primitiveField2 = createMockField(true);
      const schema = createMockSchema([primitiveField1, primitiveField2]);

      expect(hasNestedFields(schema)).toBe(false);
    });
  });

  describe('when schema has circular fields', () => {
    it('should return false for schema with only circular fields', () => {
      const circularField = createMockField(false, true);
      const schema = createMockSchema([circularField]);

      expect(hasNestedFields(schema)).toBe(false);
    });

    it('should return false for schema with primitive and circular fields', () => {
      const primitiveField = createMockField(true);
      const circularField = createMockField(false, true);
      const schema = createMockSchema([primitiveField, circularField]);

      expect(hasNestedFields(schema)).toBe(false);
    });
  });

  describe('when schema has non-primitive, non-circular fields', () => {
    it('should return true for schema with one non-primitive, non-circular field', () => {
      const nestedField = createMockField(false, false);
      const schema = createMockSchema([nestedField]);

      expect(hasNestedFields(schema)).toBe(true);
    });

    it('should return true for schema with mixed field types including nested', () => {
      const primitiveField = createMockField(true);
      const circularField = createMockField(false, true);
      const nestedField = createMockField(false, false);
      const schema = createMockSchema([primitiveField, circularField, nestedField]);

      expect(hasNestedFields(schema)).toBe(true);
    });
  });

  describe('when schema has oneOf variants', () => {
    it('should return false for oneOf variants with only primitive fields', () => {
      const primitiveField = createMockField(true);
      const variant1 = createMockSchema([primitiveField]);
      const variant2 = createMockSchema([primitiveField]);
      const schema = createMockSchema([], [variant1, variant2]);

      expect(hasNestedFields(schema)).toBe(false);
    });

    it('should return false for oneOf variants with only circular fields', () => {
      const circularField = createMockField(false, true);
      const variant1 = createMockSchema([circularField]);
      const variant2 = createMockSchema([circularField]);
      const schema = createMockSchema([], [variant1, variant2]);

      expect(hasNestedFields(schema)).toBe(false);
    });

    it('should return true for oneOf variants with nested fields', () => {
      const nestedField = createMockField(false, false);
      const variant1 = createMockSchema([nestedField]);
      const schema = createMockSchema([], [variant1]);

      expect(hasNestedFields(schema)).toBe(true);
    });

    it('should return true when one oneOf variant has nested fields', () => {
      const primitiveField = createMockField(true);
      const nestedField = createMockField(false, false);
      const variant1 = createMockSchema([primitiveField]);
      const variant2 = createMockSchema([nestedField]);
      const schema = createMockSchema([], [variant1, variant2]);

      expect(hasNestedFields(schema)).toBe(true);
    });

    it('should return false for oneOf variants with no fields', () => {
      const variant1 = createMockSchema([]);
      const variant2 = createMockSchema();
      const schema = createMockSchema([], [variant1, variant2]);

      expect(hasNestedFields(schema)).toBe(false);
    });
  });

  describe('when schema has both direct fields and oneOf variants', () => {
    it('should return true when direct fields have nested fields', () => {
      const nestedField = createMockField(false, false);
      const primitiveField = createMockField(true);
      const variant = createMockSchema([primitiveField]);
      const schema = createMockSchema([nestedField], [variant]);

      expect(hasNestedFields(schema)).toBe(true);
    });

    it('should return true when oneOf variants have nested fields', () => {
      const primitiveField = createMockField(true);
      const nestedField = createMockField(false, false);
      const variant = createMockSchema([nestedField]);
      const schema = createMockSchema([primitiveField], [variant]);

      expect(hasNestedFields(schema)).toBe(true);
    });

    it('should return false when both direct fields and oneOf variants have only primitive/circular fields', () => {
      const primitiveField = createMockField(true);
      const circularField = createMockField(false, true);
      const variant = createMockSchema([primitiveField]);
      const schema = createMockSchema([circularField], [variant]);

      expect(hasNestedFields(schema)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty oneOf array', () => {
      const primitiveField = createMockField(true);
      const schema = createMockSchema([primitiveField], []);

      expect(hasNestedFields(schema)).toBe(false);
    });

    it('should handle oneOf variants with undefined fields', () => {
      const variant = createMockSchema();
      const schema = createMockSchema([], [variant]);

      expect(hasNestedFields(schema)).toBe(false);
    });
  });
});
