import { useMemo, useState } from 'react';

import type { SelectOption } from '@redocly/theme/core/openapi';

import { Dropdown as DropdownTheme } from '@redocly/theme/components/Dropdown/Dropdown';
import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { Button } from '@redocly/theme/components/Button/Button';
import { SearchIcon } from '@redocly/theme/icons/SearchIcon/SearchIcon';
import { typedMemo } from '@redocly/theme/core/openapi';

import { styled } from '../../../styled-components.js';
import { useTranslate } from '../../../hooks/index.js';

export interface DropdownProps<T> {
  value: T;
  onChange: ({ label, value }: SelectOption<T>) => void;
  options: SelectOption<T>[];
  className?: string;
  triggerVariant?: 'ghost' | 'outlined';
  triggerSize?: string;
  withSearch?: boolean;
}

function DropdownComponent<T>({
  options,
  value,
  onChange,
  className,
  triggerVariant = 'outlined',
  triggerSize = 'small',
  withSearch = false,
}: DropdownProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const translate = useTranslate();

  const activeLabel = options.find((opt) => opt.value === value)?.label;

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (option) => option.label?.toLowerCase().includes(searchValue.toLowerCase()) ?? false,
      ),
    [options, searchValue],
  );

  if (options.length === 1) return <Title>{activeLabel}</Title>;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const renderDropdownContent = () => {
    if (!withSearch) {
      return (
        <>
          {options.map((opt) => (
            <StyledDropdownMenuItem
              key={opt.label}
              active={opt.value === value}
              onAction={() => onChange(opt)}
              suffix={opt.value === value && <StyledCheckmarkIcon />}
            >
              {opt.label}
            </StyledDropdownMenuItem>
          ))}
        </>
      );
    }

    return (
      <>
        <SearchDropdownMenuItem
          prefix={
            <SearchIconWrapper>
              <SearchIcon
                color="var(--icon-color-additional)"
                onClick={(e) => e.stopPropagation()}
              />
            </SearchIconWrapper>
          }
          content={
            <SearchInput
              placeholder={translate('openapi.discriminator.searchPlaceholder', 'Search items')}
              onClick={(e) => e.stopPropagation()}
              onChange={handleSearchChange}
              value={searchValue}
            />
          }
        />
        <ScrollableContainer>
          {filteredOptions.length ? (
            filteredOptions.map((opt) => (
              <StyledDropdownMenuItem
                key={opt.label}
                active={opt.value === value}
                onAction={() => onChange(opt)}
                suffix={opt.value === value && <StyledCheckmarkIcon />}
              >
                {opt.label}
              </StyledDropdownMenuItem>
            ))
          ) : (
            <StyledNoResultsDropdownMenuItem
              content={translate('openapi.discriminator.searchNoResults', 'No items found')}
            />
          )}
        </ScrollableContainer>
      </>
    );
  };

  return (
    <DropdownTheme
      className={className}
      trigger={
        <Button variant={triggerVariant} size={triggerSize} type="button">
          {activeLabel}
        </Button>
      }
      withArrow
      onClose={() => setSearchValue('')}
    >
      <DropdownMenu>{renderDropdownContent()}</DropdownMenu>
    </DropdownTheme>
  );
}

export const Dropdown = typedMemo(DropdownComponent);

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  width: 16px;
  height: 16px;
  margin-left: auto;
`;

const StyledDropdownMenuItem = styled(DropdownMenuItem)`
  --dropdown-menu-item-justify-content: space-between;

  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xxs) var(--spacing-sm);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

const SearchDropdownMenuItem = styled(StyledDropdownMenuItem)`
  gap: 0;
  padding: var(--spacing-xxs) var(--spacing-xs);
  &:hover {
    background-color: transparent;
  }
`;

const StyledNoResultsDropdownMenuItem = styled(StyledDropdownMenuItem)`
  height: 66px;
  justify-content: center;
  &:hover,
  &:focus-visible {
    background-color: transparent;
  }
`;

const ScrollableContainer = styled.div`
  overflow-y: auto;
  max-height: 300px;
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-color-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-family: var(--font-family-base);
  padding: 0;
  margin-left: var(--spacing-xxs);

  &::placeholder {
    color: var(--search-trigger-color);
  }
`;

const Title = styled.span`
  margin-right: var(--spacing-unit);
  cursor: default;
  background: none;
  border: none;
  padding: 0;
  color: var(--text-color-primary);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-lg);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
`;
