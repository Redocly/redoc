import type { SliceContentKind, SpecSliceScope } from './types.js';

export const ASSISTANT_LINK_BASES = {
  chatgpt: 'https://chatgpt.com',
  claude: 'https://claude.ai/new',
} as const;

export const MAX_ASSISTANT_URL_LENGTH = 8000;

const INLINE_PROMPT_PREFIXES: Record<SliceContentKind, string> = {
  yaml: 'Read the yaml and answer questions based on the content.\n\n',
  graphql: 'Read the GraphQL SDL and answer questions based on the content.\n\n',
};

export function buildInlinePromptLink(
  baseUrl: string,
  content: string,
  contentKind: SliceContentKind = 'yaml',
): string | undefined {
  const url = new URL(baseUrl);
  url.searchParams.set('q', `${INLINE_PROMPT_PREFIXES[contentKind]}${content}`);
  const link = url.toString();
  return link.length <= MAX_ASSISTANT_URL_LENGTH ? link : undefined;
}

export function describeSliceScope(scope: SpecSliceScope): string | undefined {
  switch (scope.kind) {
    case 'operation':
      return `the ${scope.httpVerb.toUpperCase()} ${scope.pathName} operation`;
    case 'tag':
      return `the "${scope.tagName}" operations`;
    case 'schema':
      return `the ${scope.name} schema`;
    case 'channel':
      return `the "${scope.channelId}" channel`;
    case 'async-operation':
      return `the "${scope.operationId}" operation`;
    case 'graphql-operation':
      return `the ${scope.name} ${scope.operationType}`;
    case 'graphql-type':
      return `the ${scope.name} type`;
    case 'graphql-directive':
      return `the @${scope.name} directive`;
    case 'graphql-group':
      return scope.label ? `the "${scope.label}" section` : undefined;
    default:
      return undefined;
  }
}

export function buildFetchSpecPromptLink(
  baseUrl: string,
  specUrl: string,
  scope: SpecSliceScope,
): string {
  const about = describeSliceScope(scope);
  const question = about
    ? `answer questions about ${about}`
    : 'answer questions based on the content';
  const url = new URL(baseUrl);
  url.searchParams.set('q', `Read ${specUrl} and ${question}.`);
  return url.toString();
}
