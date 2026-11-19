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
      return `the \`${scope.httpVerb.toUpperCase()} ${scope.pathName}\` operation`;
    case 'tag':
      return `the "${scope.tagName}" tag`;
    case 'schema':
      return `the \`${scope.name}\` schema`;
    case 'channel':
      return `the \`${scope.channelId}\` channel`;
    case 'async-operation':
      return `the \`${scope.operationId}\` operation`;
    case 'graphql-operation':
      return `the \`${scope.name}\` ${scope.operationType}`;
    case 'graphql-type':
      return `the \`${scope.name}\` type`;
    case 'graphql-directive':
      return `the \`@${scope.name}\` directive`;
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

/** The sentence a slice carries in place of the description of the whole specification. */
export function describeSliceSubset(scope: SpecSliceScope): string {
  const about = describeSliceScope(scope);
  return about
    ? `This is a subset of the full specification, limited to ${about}.`
    : 'This is a subset of the full specification.';
}

type SliceCopyIntro = {
  scope: SpecSliceScope;
  title?: string;
  /** What the page is about in one line, such as `GET /pets` (`describeSliceTarget`). */
  target?: string;
  specUrl?: string;
};

/** Title, target line and subset quote above a copied slice. */
export function sliceCopyIntro({ scope, title, target, specUrl }: SliceCopyIntro): string {
  const quote = [`> ${describeSliceSubset(scope)}`];
  if (specUrl) quote.push('>', `> You can find the full specification here: ${specUrl}`);
  return [title ? `# ${title}` : '', target ? `\`${target}\`` : '', quote.join('\n')]
    .filter((part) => part !== '')
    .join('\n\n');
}

export function wrapSliceForCopy(
  content: string,
  options: SliceCopyIntro & { contentKind: SliceContentKind },
): string {
  if (!describeSliceScope(options.scope)) return content;

  return `${sliceCopyIntro(options)}\n\n${fenceSlice(content, options.contentKind)}\n`;
}

/**
 * `content` as a fenced code block tagged `contentKind`, with a fence longer than any backtick
 * run inside it (at least three), so a Markdown code fence in a description cannot close it.
 */
function fenceSlice(content: string, contentKind: SliceContentKind): string {
  let longestRun = 0;
  for (const [run] of content.matchAll(/`+/g)) longestRun = Math.max(longestRun, run.length);
  const fence = '`'.repeat(Math.max(3, longestRun + 1));

  return `${fence}${contentKind}\n${content.trimEnd()}\n${fence}`;
}
