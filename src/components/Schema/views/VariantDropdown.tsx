import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';

import type { SegmentedOption } from '@redocly/theme/core/openapi';
import type { ReactElement } from 'react';

import { typedMemo } from '@redocly/theme/core/openapi';
import { Dropdown as DropdownTheme } from '@redocly/theme/components/Dropdown/Dropdown';
import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { Button } from '@redocly/theme/components/Button/Button';
import { SearchIcon } from '@redocly/theme/icons/SearchIcon/SearchIcon';

import { useSpecTranslate } from '../../../hooks/useTranslate.js';

type VariantDropdownProps<T> = {
  value: T;
  onChange: (option: SegmentedOption<T>) => void;
  options: SegmentedOption<T>[];
  className?: string;
  triggerVariant?: 'ghost' | 'outlined';
  triggerSize?: string;
  fullWidth?: boolean;
};

const SCHEMA_VARIANT_SEARCH_THRESHOLD = 7;

function VariantDropdownComponent<T>({
  options,
  value,
  onChange,
  className,
  triggerVariant = 'outlined',
  triggerSize = 'small',
  fullWidth = false,
}: VariantDropdownProps<T>): ReactElement {
  const [searchValue, setSearchValue] = useState('');
  const translate = useSpecTranslate();

  const activeOption = options.find((opt) => opt.value === value);
  const showSearch = options.length >= SCHEMA_VARIANT_SEARCH_THRESHOLD;

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (option) => option.label?.toLowerCase().includes(searchValue.toLowerCase()) ?? false,
      ),
    [options, searchValue],
  );

  if (options.length === 1) {
    return <Title>{activeOption?.element || activeOption?.label}</Title>;
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
  };

  const renderDropdownContent = (): ReactElement => {
    if (!showSearch) {
      return (
        <>
          {options.map((opt, index) => (
            <React.Fragment key={index}>
              {opt.divider}
              <StyledDropdownMenuItem
                key={String(opt.label)}
                active={opt.value === value}
                onAction={() => onChange(opt)}
                suffix={opt.value === value ? <StyledCheckmarkIcon /> : undefined}
              >
                <OptionLabel>{opt.element || opt.label}</OptionLabel>
              </StyledDropdownMenuItem>
            </React.Fragment>
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
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            </SearchIconWrapper>
          }
          content={
            <SearchInput
              placeholder={translate('discriminator.searchPlaceholder', 'Search items')}
              onClick={(e) => e.stopPropagation()}
              onChange={handleSearchChange}
              value={searchValue}
            />
          }
        />
        <ScrollableContainer>
          {filteredOptions.length ? (
            filteredOptions.map((opt, index) => (
              <React.Fragment key={index}>
                {opt.divider}
                <StyledDropdownMenuItem
                  key={String(opt.label)}
                  active={opt.value === value}
                  onAction={() => onChange(opt)}
                  suffix={opt.value === value ? <StyledCheckmarkIcon /> : undefined}
                >
                  <OptionLabel>{opt.element || opt.label}</OptionLabel>
                </StyledDropdownMenuItem>
              </React.Fragment>
            ))
          ) : (
            <StyledNoResultsDropdownMenuItem
              content={translate('discriminator.searchNoResults', 'No items found')}
            />
          )}
        </ScrollableContainer>
      </>
    );
  };

  return (
    <StyledDropdown
      className={className}
      $fullWidth={fullWidth}
      portalled
      trigger={
        <TriggerButton
          variant={triggerVariant}
          size={triggerSize}
          type="button"
          $fullWidth={fullWidth}
        >
          <OptionLabel>{activeOption?.element || activeOption?.label}</OptionLabel>
        </TriggerButton>
      }
      withArrow
      onClose={() => setSearchValue('')}
    >
      <StyledDropdownMenu $fullWidth={fullWidth}>{renderDropdownContent()}</StyledDropdownMenu>
    </StyledDropdown>
  );
}

export const VariantDropdown = typedMemo(VariantDropdownComponent);

const StyledDropdown = styled(DropdownTheme)<{ $fullWidth?: boolean }>`
  ${({ $fullWidth }) =>
    $fullWidth &&
    `
    > div {
      min-width: 100%;
      max-width: 100%;
    }
  `}
`;

const TriggerButton = styled(Button)<{ $fullWidth?: boolean }>`
  ${({ $fullWidth }) =>
    $fullWidth &&
    `
    && {
      width: 100%;
      justify-content: space-between;
      background-color: var(--bg-color);
      padding: var(--docs-dropdown-padding-vertical) var(--docs-dropdown-padding-left);
      color: var(--text-color-primary);

      &:hover {
        background-color: var(--bg-color);
      }

      &:focus {
        background-color: var(--bg-color);
      }
    }
  `}
`;

const OptionLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledDropdownMenu = styled(DropdownMenu)<{ $fullWidth?: boolean }>`
  ${({ $fullWidth }) => $fullWidth && `min-width: 100%;`}
`;

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  width: 16px;
  height: 16px;
  margin-left: auto;
  flex-shrink: 0;
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
  padding: calc(var(--spacing-unit) / 2);
  margin: calc(var(--spacing-unit) / -2);
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
  min-width: 100px;
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
