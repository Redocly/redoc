import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

import type { JSX } from 'react';
import type { ApiItem, ApiStore } from '../../types/store.js';

import { useSearchDialog, SearchSessionProvider } from '@redocly/theme/core/openapi';

import { SearchDialog } from './SearchDialog.js';
import { SearchTrigger } from './SearchTrigger.js';
import { useSearchEngine } from '../../hooks/useSearchEngine.js';
import { RESOURCES, useTelemetry } from '../../telemetry/index.js';

export type SearchProps = {
  items: ApiItem[];
  store: ApiStore;
  basePath: string;
  /** Bundled definition — enables `$ref` resolution for schema-field results. */
  document?: Record<string, unknown>;
};

function SearchContent({ items, store, basePath, document }: SearchProps): JSX.Element {
  const telemetry = useTelemetry();
  const { isOpen, onOpen, onClose } = useSearchDialog();
  const { search, isReady, ensureIndex } = useSearchEngine(items, store, basePath, document);

  const openedByClickRef = useRef(false);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) ensureIndex();
  }, [isOpen, ensureIndex]);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current && !openedByClickRef.current) {
      telemetry.sendSearchOpenedMessage([
        {
          ...RESOURCES.searchDialog,
          method: 'shortcut',
        },
      ]);
    }
    wasOpenRef.current = isOpen;
    if (!isOpen) {
      openedByClickRef.current = false;
    }
  }, [isOpen, telemetry]);

  return (
    <SearchWrapper>
      <SearchTrigger
        isReady={isReady}
        onIntent={ensureIndex}
        onClick={() => {
          openedByClickRef.current = true;
          ensureIndex();
          onOpen();
          telemetry.sendSearchOpenedMessage([
            {
              ...RESOURCES.searchDialog,
              method: 'click',
            },
          ]);
        }}
      />
      {isOpen && <SearchDialog onClose={onClose} search={search} isReady={isReady} />}
    </SearchWrapper>
  );
}

export function Search(props: SearchProps): JSX.Element {
  return (
    <SearchSessionProvider>
      <SearchContent {...props} />
    </SearchSessionProvider>
  );
}

const SearchWrapper = styled.div`
  display: flex;
  margin: var(--sidebar-margin-horizontal, 16px);
`;
