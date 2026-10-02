type GenericObject = Record<string, unknown>;
type ExtendedError = Error & {
  code?: string;
};

type Maybe<T> = undefined | null | T;

declare module 'url-template' {
  interface UrlTemplateInstance {
    expand(context: Record<string, unknown>): string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function parse(template: string): UrlTemplateInstance;

  const UrlTemplate: {
    parse: typeof parse;
  };

  export default UrlTemplate;
}
