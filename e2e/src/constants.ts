import type { RawApiDocsOptions } from './api.js';
import type { SpecEntry } from './types';

export const defaultDownloadUrls = [
  { url: 'http://redocly.com/definition.yaml', title: 'definition.yaml' },
  { url: 'http://redocly.com/definition.json', title: 'definition.json' },
] as const;

export const defaultOptions: Partial<RawApiDocsOptions> = {
  hideDownloadButtons: false,
  downloadUrls: [...defaultDownloadUrls],
};

export const specs: SpecEntry[] = [
  { basePath: '/openapi', type: 'openapi', fixture: 'cafe' },
  { basePath: '/description-links', type: 'openapi', fixture: 'description-links' },
  { basePath: '/cafe', type: 'openapi' },
  { basePath: '/complex', type: 'openapi' },
  { basePath: '/discriminator-test', type: 'openapi' },
  { basePath: '/oneof-anyof-test', type: 'openapi' },
  { basePath: '/expand-all-test', type: 'openapi' },
  { basePath: '/oneof-recursion', type: 'openapi' },
  { basePath: '/circular', type: 'openapi', fixture: 'openapi-3-circular' },
  { basePath: '/openapi-3-2', type: 'openapi' },
  { basePath: '/streaming-test-cases', type: 'openapi' },
  { basePath: '/sync-section', type: 'openapi' },
  { basePath: '/theme', type: 'openapi', fixture: 'cafe' },
  { basePath: '/menu', type: 'openapi', fixture: 'menu' },
  {
    basePath: '/schema-definition-markdoc',
    type: 'openapi',
    fixture: 'schema-definition-markdoc',
  },
  { basePath: '/menu-with-tags', type: 'openapi', fixture: 'menu-with-tags' },
  {
    basePath: '/menu-with-tag-groups',
    type: 'openapi',
    fixture: 'menu-with-tag-groups',
  },
  {
    basePath: '/theme-colors-primary',
    type: 'openapi',
    fixture: 'cafe',
    css: `html:root {
      --text-color-primary: #f66;
      --color-primary-500: red;
      --link-color-primary: var(--color-primary-500);
      --link-hover-text-color: var(--color-primary-100);
    }`,
  },
  {
    basePath: '/theme-middle-panel',
    type: 'openapi',
    fixture: 'cafe',
    css: `html:root {
      --samples-panel-block-background-color: #1f2933;
      --samples-panel-width: 40%;
      --layout-middle-panel-large-max-width: 750px;
      --layout-three-panel-large-max-width: 80%;
      --samples-panel-gap: 40px;
    }`,
  },
  {
    basePath: '/asyncapi',
    type: 'asyncapi',
    options: {
      downloadUrls: [
        { url: 'http://redocly.com/definition.yaml', title: 'asyncapi.yaml' },
        { url: 'http://redocly.com/definition.json', title: 'asyncapi.json' },
      ],
    },
  },
  {
    basePath: '/asyncapi-amqp',
    type: 'asyncapi',
    fixture: 'asyncapi-amqp',
  },
  {
    basePath: '/asyncapi-oneof',
    type: 'asyncapi',
    fixture: 'asyncapi',
    options: { jsonSamplesExpandLevel: 'all' },
  },
];
