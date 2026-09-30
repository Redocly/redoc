/**
 * Ambient surface for the built library: `bundles/` is generated, so tsconfig `paths` pointing at
 * its `.d.ts` would break a clean checkout. `ce-build-purity.spec.ts` asserts this exact set.
 */
declare module 'redoc' {
  import type { ComponentType, ReactElement, ReactNode } from 'react';

  export type RedocStandaloneProps = {
    spec?: Record<string, unknown> | string;
    specUrl?: string;
    options?: Record<string, unknown>;
    basePath?: string;
    logo?: { url?: string; href?: string; altText?: string; backgroundColor?: string };
    markdownAdapter?: MarkdownAdapter;
    onLoaded?: (error?: Error) => void;
    children?: ReactNode;
  };

  export type MarkdownAdapter = {
    parse: (source: unknown) => unknown;
    render: (parsed: unknown) => ReactNode;
  };

  export type PreparedApiDocs = {
    items: unknown[];
    store: unknown;
    options: Record<string, unknown>;
    specType: 'openapi' | 'asyncapi' | 'graphql';
    document?: Record<string, unknown>;
  };

  export type RedocProps = {
    items: unknown[];
    store: unknown;
    options: Record<string, unknown>;
    basePath: string;
    markdownAdapter: MarkdownAdapter;
  };

  export const RedocStandalone: ComponentType<RedocStandaloneProps>;
  export const Redoc: ComponentType<RedocProps>;
  export function prepareApiDocs(
    args: Pick<RedocStandaloneProps, 'spec' | 'specUrl' | 'options' | 'basePath'>,
  ): Promise<PreparedApiDocs>;
  export function convertSwagger2OpenAPI(
    definition: Record<string, unknown>,
  ): Promise<Record<string, unknown>> | Record<string, unknown>;
  export class ServerStyleSheet {
    collectStyles(children: ReactNode): ReactElement;
    getStyleTags(): string;
    seal(): void;
  }
}
