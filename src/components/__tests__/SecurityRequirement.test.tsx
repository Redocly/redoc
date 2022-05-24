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
import { OpenAPISpec } from '../../types';
import { SecurityDefs } from '../SecuritySchemes/SecuritySchemes';

const spec: OpenAPISpec = {
  openapi: '3.0',
  info: {
    title: 'test',
    version: '0',
  },
  paths: {
    '/pet': {
      post: {
        summary: 'Add a new pet to the store',
        description: 'Add new pet to the store inventory.',
        operationId: 'addPet',
        responses: {
          '405': {
            description: 'Invalid input',
          },
        },
        security: [
          {
            petstore_auth: ['write:pets', 'read:pets'],
          },
        ],
      },
      put: {
        summary: 'Add a new pet to the store',
        description: 'Add new pet to the store inventory.',
        operationId: 'updatePet',
        responses: {
          '405': {
            description: 'Invalid input',
          },
        },
        security: [
          {
            GitLab_PersonalAccessToken: [],
            GitLab_OAuth2Implicit: ['api'],
            GitLab_OAuth2AuthorizationCode: ['api'],
          },
          {
            petstore_auth: ['write:pets', 'read:pets'],
          },
        ],
      },
    },
  },
  components: {
    securitySchemes: {
      petstore_auth: {
        description:
          'Get access to data while protecting your account credentials.\nOAuth2 is also a safer and more secure way to give you access.\n',
        type: 'oauth2',
        bearerFormat: '',
        flows: {
          implicit: {
            authorizationUrl: 'http://petstore.swagger.io/api/oauth/dialog',
            scopes: {
              'write:pets': 'modify pets in your account',
              'read:pets': 'read your pets',
            },
          },
        },
      },
      GitLab_PersonalAccessToken: {
        description: 'GitLab Personal Access Token description',
        type: 'apiKey',
        name: 'PRIVATE-TOKEN',
        in: 'header',
        bearerFormat: '',
        flows: {},
      },
      GitLab_OAuth2Implicit: {
        description: 'OAuth2 Implicit description',
        bearerFormat: '',
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'https://gitlab.com/oauth/authorize',
            scopes: {
              api: 'Grants complete read/write access to the API, including all groups and projects, the container registry, and the package registry.',
              read_user:
                "Grants read-only access to the authenticated user's profile through the /user API endpoint, which includes username, public email, and full name. Also grants access to read-only API endpoints under /users.",
              read_api:
                'Grants read access to the API, including all groups and projects, the container registry, and the package registry.',
              read_repository:
                'Grants read-only access to repositories on private projects using Git-over-HTTP or the Repository Files API.',
            },
          },
        },
      },
      GitLab_OAuth2AuthorizationCode: {
        description: 'OAuth2 Authorization Code description',
        type: 'oauth2',
        bearerFormat: '',
        flows: {
          authorizationCode: {
            tokenUrl: 'https://gitlab.com/oauth/token',
            scopes: {
              api: 'Grants complete read/write access to the API, including all groups and projects, the container registry, and the package registry.',
              read_user:
                "Grants read-only access to the authenticated user's profile through the /user API endpoint, which includes username, public email, and full name. Also grants access to read-only API endpoints under /users.",
              read_api:
                'Grants read access to the API, including all groups and projects, the container registry, and the package registry.',
            },
          },
        },
      },
    },
  },
};

describe('SecurityRequirement', () => {
  it('should render authDefinition', async () => {
    const store = await createStore(spec, undefined, { showSecuritySchemeType: true });

    store.spec.contentItems.forEach((item: OperationModel) => {
      if (item.security) {
        const component = mount(
          withTheme(
            <StoreProvider value={store}>
              <SecurityRequirements securities={item.security} />,
            </StoreProvider>,
          ),
        );
        expect(component.render()).toMatchSnapshot();
        component.find('svg').simulate('click');
        //Security expanded
        expect(component.render()).toMatchSnapshot();
      }
    });
  });

  it('should render SecurityDefs', async () => {
    const parser = new OpenAPIParser(spec, undefined, new RedocNormalizedOptions({}));

    const component = mount(
      withTheme(<SecurityDefs securitySchemes={new SecuritySchemesModel(parser)} />),
    );
    expect(component.render()).toMatchSnapshot();
  });
});
