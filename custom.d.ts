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

declare var __DEV__: boolean;

declare type Dict<T> = {
  [key: string]: T;
};
