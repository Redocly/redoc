/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import * as React from 'react';

import { SchemaDefinition } from '..';
import { OpenAPIParser } from '../../services';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';
import { withTheme } from '../testProviders';

const options = new RedocNormalizedOptions({});
describe('Components', () => {
  describe('SchemaDefinition', () => {
    const parser = new OpenAPIParser(
      {
        openapi: '3.0',
        info: {
          title: 'test',
          version: '0',
        },
        paths: {},
        components: {
          schemas: {
            test: {
              description: 'schema_description',
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
            test_no_description: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      undefined,
      options,
    );

    describe('Show example constraints', () => {
      it('should show the example as default', () => {
        const component = shallow(
          withTheme(
            <SchemaDefinition
              schemaRef="#/components/schemas/test"
              parser={parser}
              options={options}
            />,
          ),
        );
        expect(component.html().includes('<code>')).toBe(true);
      });

      it('should show the example if `showExample` is `true`', () => {
        const component = shallow(
          withTheme(
            <SchemaDefinition
              schemaRef="#/components/schemas/test"
              parser={parser}
              options={options}
              showExample={true}
            />,
          ),
        );
        expect(component.html().includes('<code>')).toBe(true);
      });

      it('should hide the example if `showExample` is `false`', () => {
        const component = shallow(
          withTheme(
            <SchemaDefinition
              schemaRef="#/components/schemas/test"
              parser={parser}
              options={options}
              showExample={false}
            />,
          ),
        );
        expect(component.html().includes('<code>')).toBe(false);
      });
    });

    describe('Show description constraints', () => {
      it('should hide the description as default', () => {
        const component = shallow(
          withTheme(
            <SchemaDefinition
              schemaRef="#/components/schemas/test"
              parser={parser}
              options={options}
              showExample={false}
            />,
          ),
        );
        expect(component.html().includes('schema_description')).toBe(false);
      });

      it('should hide the description if `showDescription` is `false`', () => {
        const component = shallow(
          withTheme(
            <SchemaDefinition
              schemaRef="#/components/schemas/test"
              parser={parser}
              options={options}
              showExample={false}
              showDescription={false}
            />,
          ),
        );
        expect(component.html().includes('schema_description')).toBe(false);
      });

      it('should show the description if `showDescription` is `true`', () => {
        const component = shallow(
          withTheme(
            <SchemaDefinition
              schemaRef="#/components/schemas/test"
              parser={parser}
              options={options}
              showExample={false}
              showDescription={true}
            />,
          ),
        );
        expect(component.html().includes('schema_description')).toBe(true);
      });

      it('not to thrown error if `showDescription` is `true` and without description', () => {
        const component = shallow(
          withTheme(
            <SchemaDefinition
              schemaRef="#/components/schemas/test_no_description"
              parser={parser}
              options={options}
              showExample={false}
              showDescription={true}
            />,
          ),
        );
        expect(() => {
          component.html();
        }).not.toThrow();
      });
    });
  });
});
