import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { OpenAPIParser, SchemaModel } from '../../../services';
import { Schema } from '../Schema';
import { ObjectSchema } from '../ObjectSchema';
import * as simpleDiscriminatorFixture from './fixtures/simple-discriminator.json';

describe('Components', () => {
  describe('SchemaView', () => {
    describe('discriminator', () => {
      it('should correctly render SchemaView', () => {
        const parser = new OpenAPIParser(simpleDiscriminatorFixture);

        const schema = new SchemaModel(
          parser,
          { $ref: '#/components/schemas/Pet' },
          '#/components/schemas/Pet',
        );
        const schemaView = shallow(<Schema schema={schema} />);
        expect(toJson(schemaView)).toMatchSnapshot();
      });

      it('should correctly render discriminator dropdown', () => {
        const parser = new OpenAPIParser(simpleDiscriminatorFixture);

        const schema = new SchemaModel(
          parser,
          { $ref: '#/components/schemas/Pet' },
          '#/components/schemas/Pet',
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
        expect(toJson(schemaView)).toMatchSnapshot();
      });
    });
  });
});
