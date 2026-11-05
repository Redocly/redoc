import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ApiStore } from '../types/store.js';
import type { RawApiDocsOptions } from '../types/options.js';

import RedoclyApiDocsStandalone from '../RedoclyApiDocsStandalone.js';

vi.mock('../components/Search/index.js', () => ({
  Search: (): never => {
    throw new TypeError('Cannot read properties of undefined');
  },
}));
vi.mock('../components/SideMenu/SideMenu.js', () => ({
  SideMenu: () => <nav data-testid="side-menu" />,
}));

const EMPTY_STORE: ApiStore = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

describe('standalone sidebar boundaries', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleError.mockRestore();
    cleanup();
  });

  it('a crashing search leaves the side menu rendered', async () => {
    await act(async () => {
      render(
        <RedoclyApiDocsStandalone
          items={[]}
          store={EMPTY_STORE}
          basePath="/"
          options={{ specType: 'openapi' } as RawApiDocsOptions}
        />,
      );
    });

    expect(screen.getByTestId('side-menu')).toBeInTheDocument();
  });
});
