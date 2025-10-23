import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { SearchItemData } from '../../services/search/types.js';

import { breakpoints, useModalScrollLock, useDialogHotKeys } from '@redocly/theme/core/openapi';
import { SearchInput } from '@redocly/theme/components/Search/SearchInput';
import { SearchItem } from '@redocly/theme/components/Search/SearchItem';
import { SearchShortcut } from '@redocly/theme/components/Search/SearchShortcut';
import { Button } from '@redocly/theme/components/Button/Button';

import { styled } from '../../styled-components.js';
import { useTelemetry } from '../../hooks/useTelemetry.js';

export type SearchDialogProps = {
  onClose: () => void;
  search: (query: string) => SearchItemData[];
  isReady: boolean;
};

export function SearchDialog({ onClose, search, isReady }: SearchDialogProps) {
  const telemetry = useTelemetry();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItemData[]>([]);

  useEffect(() => {
    setSearchResults(query ? search(query) : []);
  }, [query, search]);

  useEffect(() => {
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, []);

  useModalScrollLock(true);
  useDialogHotKeys(modalRef, onClose);

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (typeof target.className !== 'string') return;
      if (target.className?.includes(' overlay')) {
        onClose();
      }
    },
    [onClose],
  );

  const searchDialogContent = (
    <SearchOverlay
      onClick={handleOverlayClick}
      className="overlay"
      ref={modalRef}
      data-testid="search-dialog"
    >
      <SearchDialogWrapper>
        <SearchDialogHeader>
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              if (value === '') {
                return telemetry.sendSearchInputResetButtonClickedMessage();
              }
            }}
            placeholder="Search docs..."
            isLoading={!isReady}
            inputRef={searchInputRef}
            onSubmit={() => {}}
            data-translation-key="search.label"
            data-testid="search-input"
          />
        </SearchDialogHeader>
        <SearchDialogBody>
          {query ? (
            searchResults.length ? (
              searchResults.map((item, index) => {
                return (
                  <SearchItem
                    key={index}
                    item={item}
                    onClick={() => {
                      telemetry.sendSearchResultClickedMessage({
                        wordCount: query.split(' ').length.toString(),
                        url: item.document.url,
                        totalResults: searchResults.length.toString(),
                        index: index.toString(),
                      });
                      onClose();
                    }}
                    data-testid="search-item"
                  />
                );
              })
            ) : (
              <SearchMessage data-testid="search-message">No results</SearchMessage>
            )
          ) : (
            <SearchMessage data-testid="search-message">
              Search endpoints, schemas, and more...
            </SearchMessage>
          )}
        </SearchDialogBody>

        <SearchDialogFooter>
          <SearchShortcuts>
            <SearchShortcut
              data-translation-key="search.keys.navigate"
              combination="Tab"
              text="to navigate"
            />
            <SearchShortcut
              data-translation-key="search.keys.select"
              combination="⏎"
              text="to select"
            />
            <SearchShortcut
              data-translation-key="search.keys.exit"
              combination="Esc"
              text="to exit"
            />
          </SearchShortcuts>
          <SearchCancelButton
            data-translation-key="search.cancel"
            variant="secondary"
            size="small"
            onClick={onClose}
          >
            Cancel
          </SearchCancelButton>
        </SearchDialogFooter>
      </SearchDialogWrapper>
    </SearchOverlay>
  );

  // Render the search dialog using a portal to avoid being clipped by the sidebar's overflow
  return createPortal(searchDialogContent, document.body);
}

const SearchOverlay = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-color-modal-overlay);
  z-index: var(--z-index-overlay);

  @media screen and (max-width: ${breakpoints.small}) {
    align-items: start;
    position: fixed;
    overflow: hidden;
    overscroll-behavior: none;
  }
`;

const SearchDialogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100vw;
  height: 100vh;
  background: var(--search-modal-bg-color);
  box-shadow: var(--search-modal-box-shadow);
  border-radius: 0;

  @media screen and (max-width: ${breakpoints.small}) {
    min-height: -webkit-fill-available !important;
    min-height: 100dvh !important;
    height: auto !important;
    width: 100vw !important;
  }

  @media screen and (min-width: ${breakpoints.small}) {
    border-radius: var(--search-modal-border-radius);
    width: var(--search-modal-width);
    min-height: var(--search-modal-min-height);
    min-width: var(--search-modal-min-width);
    max-width: 95vw;
    max-height: 95vh;
    height: var(--search-modal-min-height);
    resize: both;
  }
`;

const SearchDialogHeader = styled.header`
  display: flex;
  align-items: center;
  border-bottom: var(--search-modal-border);
  background-color: var(--search-modal-header-bg-color);
  padding: var(--search-modal-header-padding);
`;

const SearchDialogBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
`;

const SearchMessage = styled.div`
  display: flex;
  height: 40%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: var(--search-message-font-size);
  font-weight: var(--search-message-font-weight);
  line-height: var(--search-message-line-height);
  color: var(--search-message-text-color);
  gap: var(--search-message-gap);
  padding: var(--search-message-padding);
`;

const SearchDialogFooter = styled.footer`
  display: flex;
  gap: var(--search-modal-footer-gap);
  padding: var(--search-modal-footer-padding);
  border-top: var(--search-modal-border);
`;

const SearchShortcuts = styled.div`
  display: none;
  justify-content: flex-start;
  align-items: center;
  gap: var(--search-shortcuts-gap);

  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
  }
`;

const SearchCancelButton = styled(Button)`
  width: 100%;

  @media screen and (min-width: ${breakpoints.small}) {
    display: none;
  }
`;
