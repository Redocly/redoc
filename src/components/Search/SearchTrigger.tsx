import { useState, useEffect } from 'react';

import type { JSX } from 'react';

import { Button } from '@redocly/theme/components/Button/Button';
import { SearchIcon } from '@redocly/theme/icons/SearchIcon/SearchIcon';

import { styled } from '../../styled-components.js';
import { useTranslate } from '../../hooks/index.js';

export type SearchTriggerProps = {
  onClick: () => void;
  className?: string;
  variant?: 'button' | 'input';
  isReady: boolean;
};

export function SearchTrigger({
  onClick,
  className,
  variant = 'input',
  isReady,
}: SearchTriggerProps): JSX.Element {
  const translate = useTranslate();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Only detect Mac on client-side after hydration
    setIsMac(typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac'));
  }, []);

  return (
    <SearchTriggerWrapper onClick={onClick} className={className} data-testid="search-trigger">
      {variant === 'button' ? (
        <SearchTriggerButton
          variant="text"
          size="medium"
          icon={<SearchIcon />}
          aria-label="Search trigger button"
        />
      ) : (
        <SearchTriggerInput>
          <SearchIcon />
          {isReady ? (
            <>
              {translate('search.navbar.label', 'Search ')}
              {isMac ? '⌘K' : 'Ctrl+K'}
            </>
          ) : (
            <span>{translate('openapi.loading', 'Loading...')}</span>
          )}
        </SearchTriggerInput>
      )}
    </SearchTriggerWrapper>
  );
}

const SearchTriggerWrapper = styled.div`
  color: var(--search-trigger-color);
  line-height: var(--search-trigger-line-height);
  flex-grow: 1;

  svg {
    width: var(--search-trigger-icon-size);
    height: var(--search-trigger-icon-size);
  }
`;

const SearchTriggerButton = styled(Button)`
  display: inline-flex;
`;

const SearchTriggerInput = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: left;
  gap: var(--search-trigger-gap);
  width: 100%;
  border: var(--search-trigger-border-width) var(--search-trigger-border-style)
    var(--search-trigger-border-color);
  border-radius: var(--search-trigger-border-radius);
  background: var(--search-trigger-bg-color);
  padding: var(--search-trigger-padding);

  &:hover {
    border-color: var(--search-trigger-border-color-hover);
  }
`;
