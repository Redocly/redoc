/* eslint-disable import/no-internal-modules */
/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import { filterPropsDeep } from '../../utils/test-utils';

import { ObjectSchema, Schema } from '../';
import { DiscriminatorDropdown } from '../Schema/DiscriminatorDropdown';
import { OpenAPIParser, SchemaModel } from '../../services';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';
import * as simpleDiscriminatorFixture from './fixtures/simple-discriminator.json';
import * as oneOfDiscriminatorNoPropFixture from './fixtures/oneof-discriminator-no-prop.json';

const options = new RedocNormalizedOptions({});
describe('Components', () => {
  describe('SchemaView', () => {
    describe('discriminator', () => {
      it('should correctly render SchemaView', () => {
        const parser = new OpenAPIParser(simpleDiscriminatorFixture, undefined, options);

        const schema = new SchemaModel(
          parser,
          { $ref: '#/components/schemas/Pet' },
          '#/components/schemas/Pet',
          options,
        );
        const schemaViewElement = shallow(<Schema schema={schema} />).getElement();
        expect(schemaViewElement).toMatchSnapshot();
        expect(schemaViewElement.props.discriminator).toBeDefined();
        expect(schemaViewElement.props.discriminator.parentSchema).toBeDefined();
        expect(schemaViewElement.props.discriminator.fieldName).toEqual('type');
      });

      it('should correctly render discriminator dropdown', () => {
        const parser = new OpenAPIParser(simpleDiscriminatorFixture, undefined, options);

        const schema = new SchemaModel(
          parser,
          { $ref: '#/components/schemas/Pet' },
          '#/components/schemas/Pet',
          options,
        );
        const schemaView = shallow(
          <ObjectSchema
            schema={schema.oneOf![0]}
            discriminator={{
              fieldName: schema.discriminatorProp,
              parentSchema: schema,
            }}
          />,
        );
        expect(filterPropsDeep(toJson(schemaView), ['field.schema.options'])).toMatchSnapshot();
      });

      it('should still render the dropdown when variants do not declare the discriminator property', () => {
        // oneOf + discriminator where the variant schemas (CardPaymentInput, CashPaymentInput)
        // neither declare `__typename` nor inherit it via allOf. Previously the selector was
        // attached only to a matching field row, so it silently disappeared and only the first
        // variant was shown. The dropdown must now render standalone.
        const parser = new OpenAPIParser(oneOfDiscriminatorNoPropFixture, undefined, options);
        const schema = new SchemaModel(
          parser,
          { $ref: '#/components/schemas/PaymentInput' },
          '#/components/schemas/PaymentInput',
          options,
        );

        expect(schema.discriminatorProp).toEqual('__typename');
        expect(schema.oneOf).toHaveLength(2);
        // sanity: the active variant genuinely has no field named like the discriminator
        expect(schema.oneOf![0].fields?.some(f => f.name === schema.discriminatorProp)).toBe(false);

        const schemaView = shallow(
          <ObjectSchema
            schema={schema.oneOf![0]}
            discriminator={{
              fieldName: schema.discriminatorProp,
              parentSchema: schema,
            }}
          />,
        );
        expect(schemaView.find(DiscriminatorDropdown)).toHaveLength(1);
      });

      it('should not render a standalone dropdown when the variant declares the discriminator property', () => {
        // Regression guard for the standard allOf-inheritance pattern: the discriminator field
        // exists on the variant, so the selector stays inline on that field row and no extra
        // standalone dropdown is added at the ObjectSchema level.
        const parser = new OpenAPIParser(simpleDiscriminatorFixture, undefined, options);
        const schema = new SchemaModel(
          parser,
          { $ref: '#/components/schemas/Pet' },
          '#/components/schemas/Pet',
          options,
        );
        const schemaView = shallow(
          <ObjectSchema
            schema={schema.oneOf![0]}
            discriminator={{
              fieldName: schema.discriminatorProp,
              parentSchema: schema,
            }}
          />,
        );
        // the inline dropdown lives inside a <Field> render prop and is not a direct child here
        expect(schemaView.find(DiscriminatorDropdown)).toHaveLength(0);
      });
    });
  });
});
