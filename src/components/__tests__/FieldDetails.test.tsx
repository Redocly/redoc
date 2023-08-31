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
});
