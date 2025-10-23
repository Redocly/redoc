/// <reference path="node_modules/redoc/typings/styled-patch.d.ts" />

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type Interface<T> = {
  [P in keyof T]: T[P];
};

interface Window {
  __REDOCLY_SEARCH_URL?: string;
}

declare let REDOCLY_PUBLIC_KEY: string;

declare let __redoc_state: any;

/// <reference path="src/redoc-lib/typings/styled-patch.d.ts" />

declare module '*.json' {
  const content: any;
  export = content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare let __REDOC_VERSION__: string;
declare let __REDOC_REVISION__: string;

declare let reactHotLoaderGlobal: any;

interface Element {
  scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
}

type Maybe<T> = undefined | null | T;

type GenericObject = Record<string, any>;
type ExtendedError = Error & {
  code?: string;
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare type Dictionary<T, K extends string | number = string> = {
  [key in K]: T;
};
