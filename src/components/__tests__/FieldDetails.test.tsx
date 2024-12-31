import * as React from 'react';
import { shallow } from 'enzyme';

import { FieldDetails } from '../Fields/FieldDetails';
import { SchemaModel } from '../../services/models/Schema';
import { withTheme } from '../testProviders';

jest.mock('../ExternalDocumentation/ExternalDocumentation', () => ({
  ExternalDocumentation: () => {
    return <div />;
  },
}));

describe('FieldDetailsComponent', () => {
  it('renders correctly', () => {
    const mockFieldProps = {
      showExamples: true,
      field: {
        schema: {
          type: 'array',
          default: [],
          typePrefix: 'test type prefix',
          displayType: 'array',
          title: 'test title',
          externalDocs: undefined,
          constraints: [''],
        } as SchemaModel,
        example: 'example',
        name: 'name',
        expanded: false,
        required: false,
        kind: '',
        deprecated: false,
        collapse: jest.fn(),
        toggle: jest.fn(),
        explode: false,
        expand: jest.fn(),
        description: 'test description',
      },
      renderDiscriminatorSwitch: jest.fn(),
    };

    const wrapper = shallow(withTheme(<FieldDetails {...mockFieldProps} />));

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('renders correctly when default value is object in request body', () => {
    const mockFieldProps = {
      showExamples: true,
      field: {
        schema: {
          type: 'object',
          default: { properties: {} },
          displayType: 'object',
          title: 'test title',
          externalDocs: undefined,
          constraints: [''],
        } as SchemaModel,
        example: 'example',
        name: 'name',
        expanded: false,
        required: false,
        kind: '',
        deprecated: false,
        collapse: jest.fn(),
        toggle: jest.fn(),
        explode: false,
        expand: jest.fn(),
        description: 'test description',
        in: undefined,
      },
      renderDiscriminatorSwitch: jest.fn(),
    };
    const wrapper = shallow(withTheme(<FieldDetails {...mockFieldProps} />));

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('renders correctly when field items have string type and pattern', () => {
    const mockFieldProps = {
      showExamples: true,
      field: {
        schema: {
          type: 'array',
          displayType: 'Array of strings',
          title: 'test title',
          externalDocs: undefined,
          constraints: [''],
          items: {
            type: 'string',
            pattern: '^see regex[0-9]$',
            constraints: ['<= 128 characters'],
            externalDocs: undefined,
          },
        } as any as SchemaModel,
        example: 'example',
        name: 'name',
        expanded: false,
        required: false,
        kind: '',
        deprecated: false,
        collapse: jest.fn(),
        toggle: jest.fn(),
        explode: false,
        expand: jest.fn(),
        description: 'test description',
        in: undefined,
      },
      renderDiscriminatorSwitch: jest.fn(),
    };
    const wrapper = shallow(withTheme(<FieldDetails {...mockFieldProps} />));

    expect(wrapper.render()).toMatchSnapshot();
  });
});
