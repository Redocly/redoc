export interface RedocInitOptions {
  router?: 'history' | 'hash';
  basePath?: string;
  [key: string]: unknown;
}

export interface RedocRoot {
  unmount(): void;
}

export interface RedocGlobal {
  init(
    specOrUrl: string | object,
    options: RedocInitOptions,
    element: HTMLElement,
  ): RedocRoot | undefined;
}

const BUNDLE_URL = new URL(
  'redoc.standalone.js',
  new URL(import.meta.env.BASE_URL, window.location.origin),
).href;

let loaded: Promise<RedocGlobal> | undefined;

export function loadRedoc(): Promise<RedocGlobal> {
  loaded ??= import(/* @vite-ignore */ BUNDLE_URL).then((bundle: Partial<RedocGlobal>) => {
    if (typeof bundle.init !== 'function') {
      throw new Error('redoc.standalone.js does not export init()');
    }
    return bundle as RedocGlobal;
  });
  return loaded;
}
