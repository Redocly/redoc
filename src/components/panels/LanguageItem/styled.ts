import { styled, css } from 'styled-components';

import type { DropdownMenuItemProps } from '@redocly/theme/components/Dropdown/DropdownMenuItem';

import { Button } from '@redocly/theme/components/Button/Button';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';

import { ITEM_WIDTH } from './constants.js';

const TAB_STRIP_GAP = 'var(--spacing-unit)';

export const RightAlignedDropdownMenu = styled(DropdownMenu)`
  position: absolute;
  right: 0;
`;

export const Container = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${TAB_STRIP_GAP};
`;

export const LanguageTitle = styled.span<{ $active?: boolean }>`
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 var(--spacing-xxs);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: ${({ $active }) =>
    $active ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)'};
`;

export const LanguageTitleContainer = styled.span`
  width: 100%;
  display: inherit;
  gap: inherit;
  flex-direction: inherit;
  justify-content: inherit;
  align-items: inherit;
`;

export const LanguageIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

export const LanguageListContainer = styled.div<{ $justifyContent?: string }>`
  display: flex;
  justify-content: ${({ $justifyContent = 'start' }) => $justifyContent};
  align-items: center;
  width: 100%;
`;

export const LanguageListItem = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  width: ${ITEM_WIDTH}px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
  gap: calc(var(--spacing-unit) * 0.5);
  padding: var(--spacing-xs) 0;
  color: ${({ $active }) =>
    $active ? 'var(--text-color-primary)' : 'var(--text-color-description)'};
  border-radius: var(--border-radius);
  text-align: center;
  position: relative;

  &:hover {
    color: var(--text-color-primary);
    background-color: var(--layer-color-hover);
  }

  ${({ $active }) =>
    $active &&
    css`
      &::before {
        position: absolute;
        top: calc(-1 * ${TAB_STRIP_GAP} - 1px);
        left: 0;
        border-top: 3px solid var(--text-color-primary);
        width: 100%;
        content: '';
        border-bottom-left-radius: calc(var(--border-radius) / 2);
        border-bottom-right-radius: calc(var(--border-radius) / 2);
      }
    `}
`;

export const StyledDropdownMenuItem = styled(DropdownMenuItem)<
  DropdownMenuItemProps & { $width?: number }
>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-xs);
  padding: calc(var(--spacing-unit) * 1.5) var(--spacing-xs) calc(var(--spacing-unit) * 1.5)
    var(--spacing-sm);
  width: ${({ $width = 204 }) => $width}px;
  fill: var(--menu-content-color-active);

  ${LanguageTitleContainer} {
    width: auto;
    justify-content: flex-start;
  }
`;

export const DropdownTriggerButton = styled(Button)`
  display: inline-flex;

  line-height: var(--line-height-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
`;

export const StaticLanguageLabel = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: var(--line-height-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  color: var(--text-color-secondary);
`;
