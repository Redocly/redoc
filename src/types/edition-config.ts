import type { AsyncApiConfig, GraphQLConfig, RedocConfig } from '@redocly/config';

type EnterpriseOnlyOptionKey =
  | 'licenseKey'
  | 'hideReplay'
  | 'mockServer'
  | 'corsProxyUrl'
  | 'oAuth2RedirectURI'
  | 'feedback'
  | 'hideInfoMetadata'
  | 'showSchemaCatalogLinks';

export type EditionRedocConfig = Omit<RedocConfig, EnterpriseOnlyOptionKey>;
export type EditionAsyncApiConfig = Omit<AsyncApiConfig, EnterpriseOnlyOptionKey>;
export type EditionGraphQLConfig = Omit<GraphQLConfig, EnterpriseOnlyOptionKey>;
