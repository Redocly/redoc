import * as React from 'react';
import { mount } from 'enzyme';

import {
  createStore,
  OpenAPIParser,
  OperationModel,
  RedocNormalizedOptions,
  SecuritySchemesModel,
} from '../../services';
import { StoreProvider } from '../StoreBuilder';
import { SecurityRequirements } from '../SecurityRequirement/SecurityRequirement';
import { withTheme } from '../testProviders';
import { SecurityDefs } from '../SecuritySchemes/SecuritySchemes';
import * as simpleSecurityFixture from './fixtures/simple-security-fixture.json';

describe('SecurityRequirement', () => {
  it('should render authDefinition', async () => {
    const store = await createStore(simpleSecurityFixture, undefined, {
      showSecuritySchemeType: true,
    });

    store.spec.contentItems.forEach((item: OperationModel) => {
      if (item.security) {
        const component = mount(
          withTheme(
            <StoreProvider value={store}>
              <SecurityRequirements securities={item.security} />,
            </StoreProvider>,
          ),
        );
        expect(component.html()).toMatchSnapshot();
        component.find('svg').simulate('click');
        //Security expanded
        expect(component.html()).toMatchSnapshot();
      }
    });
  });

  it('should render SecurityDefs', async () => {
    const parser = new OpenAPIParser(
      simpleSecurityFixture,
      undefined,
      new RedocNormalizedOptions({}),
    );

    const component = mount(
      withTheme(<SecurityDefs securitySchemes={new SecuritySchemesModel(parser)} />),
    );
    expect(component.html()).toMatchSnapshot();
  });

  it('should hide authDefinition', async () => {
    const store = await createStore(simpleSecurityFixture, undefined, {
      hideSecuritySection: true,
    });

    store.spec.contentItems.forEach((item: OperationModel) => {
      if (item.security) {
        const component = mount(
          withTheme(
            <StoreProvider value={store}>
              <SecurityRequirements securities={item.security} />,
            </StoreProvider>,
          ),
        );
        expect(component.html().includes('Authorizations')).toBe(false);
        expect(component.html().includes('svg')).toBe(false);
      }
    });
  });
});
