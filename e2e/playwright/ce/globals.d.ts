/** Test-only globals the fixture pages and React host record results on. */
declare global {
  interface Window {
    Redoc?: {
      init: (
        specOrSpecUrl: string | Record<string, unknown>,
        options?: Record<string, unknown>,
        element?: Element | null,
      ) => void;
      RedocStandalone: unknown;
    };
    __initError?: string;
    __loaded?: Array<{ ok: boolean; message?: string }>;
    __caseError?: string;
    __styleTags?: string;
    __events?: Array<Record<string, unknown>>;
  }
}

export {};
