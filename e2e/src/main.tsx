/** Drops the `/pluggable/<component>` harness, which has no counterpart in this build. */
import { createRoot } from 'react-dom/client';

import type { RawApiDocsOptions, ApiSpecType } from './api.js';
import type { SpecEntry } from './types.js';
import type { AppProps } from './App.js';

import App from './App.js';
import { specs } from './constants.js';

function fixtureExtension(type: ApiSpecType): string {
  return type === 'graphql' ? '.graphql' : '.yaml';
}

function resolveSpecUrl(entry: SpecEntry): string {
  const name = entry.fixture ?? entry.basePath.slice(1);
  return `/fixtures/${name}${fixtureExtension(entry.type)}`;
}

function findSpec(pathname: string): SpecEntry | undefined {
  return specs.find((s) => pathname === s.basePath || pathname.startsWith(s.basePath + '/'));
}

function resolveRoute(): AppProps & { remountKey: string } {
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const spec = findSpec(pathname);

  if (spec) {
    let specUrl = resolveSpecUrl(spec);
    let options = spec.options;

    // Menu: support ?specFileName= and option overrides via query params
    if (spec.basePath === '/menu') {
      const specFileName = searchParams.get('specFileName');
      if (specFileName) {
        specUrl = `/fixtures/${specFileName}`;
      }
      const schemaDefinitionsTagName = searchParams.get('schemaDefinitionsTagName') ?? undefined;
      const routingBasePath = searchParams.get('routingBasePath') ?? undefined;
      if (schemaDefinitionsTagName || routingBasePath) {
        options = {
          ...options,
          schemaDefinitionsTagName,
          routingBasePath,
        } as Partial<RawApiDocsOptions>;
      }
    }

    // Cafe: support ?hideInfoSection=true
    if (spec.basePath === '/cafe') {
      if (searchParams.get('hideInfoSection') === 'true') {
        options = { ...options, hideInfoSection: true } as Partial<RawApiDocsOptions>;
      }
    }

    return {
      remountKey: spec.basePath,
      specUrl,
      basePath: spec.basePath,
      type: spec.type,
      options,
      customCss: spec.css,
    };
  }

  // Default: GraphQL (catch-all at /)
  return {
    remountKey: 'graphql-default',
    specUrl: '/fixtures/github.graphql',
    basePath: '/',
    type: 'graphql',
    options: {
      downloadUrls: [
        {
          url: 'https://docs.github.com/public/fpt/schema.docs.graphql',
          title: 'schema.graphql',
        },
      ],
      menu: {
        requireExactGroups: false,
        otherItemsGroupName: 'Other',
        groups: [
          {
            name: 'GraphQL custom group',
            directives: { includeByName: ['possibleTypes'] },
            mutations: { includeByName: ['acceptEnterpriseAdministratorInvitation'] },
          },
        ],
      },
    },
  };
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing #root');
}

const route = resolveRoute();
const { remountKey, ...appProps } = route;

createRoot(root).render(<App key={remountKey} {...appProps} />);
