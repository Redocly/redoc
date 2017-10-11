import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import { OpenAPIParser, Schema } from '../../../services';
import { ObjectSchemaView, SchemaView } from '../Schema';
import * as simpleDiscriminatorFixture from './fixtures/simple-discriminator.json';

describe('Components', () => {
  describe('SchemaView', () => {
    describe('discriminator', () => {
      it('should correctly render SchemaView', () => {
        const parser = new OpenAPIParser();
        parser.spec = simpleDiscriminatorFixture;

        const schema = new Schema(
          parser,
          { $ref: '#/components/schemas/Pet' },
          '#/components/schemas/Pet',
        );
        const schemaView = shallow(<SchemaView schema={schema} />);
        expect(toJson(schemaView)).toMatchSnapshot();
      });

      it('should correctly render discriminator dropdown', () => {
        const parser = new OpenAPIParser();
        parser.spec = simpleDiscriminatorFixture;

        const schema = new Schema(
          parser,
          { $ref: '#/components/schemas/Pet' },
          '#/components/schemas/Pet',
        );
        const schemaView = shallow(
          <ObjectSchemaView
            schema={schema.oneOf![0]}
            discriminator={{
              fieldName: schema.discriminator,
              parentSchema: schema,
            }}
          />,
        );
        expect(toJson(schemaView)).toMatchSnapshot();
      });
    });
  });
});
