/// <reference path="typings/styled-patch.d.ts" />

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

declare var __REDOC_VERSION__: string;
declare var __REDOC_REVISION__: string;

declare type Dict<T> = {
  [key: string]: T;
};

interface Element {
  scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
}
