import { styled } from 'styled-components';

import { PanelHeader } from '@redocly/theme/components/Panel/PanelHeader';
import { Tag } from '@redocly/theme/components/Tag/Tag';
import { Button } from '@redocly/theme/components/Button/Button';
import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';

export const StyledPanelHeader = styled(PanelHeader)`
  flex-wrap: nowrap;
  column-gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-xs);

  > :first-child {
    min-width: 0;
  }

  > :last-child {
    flex-shrink: 0;
  }
`;

export const PathWrapper = styled(Button)`
  display: inline-flex;
  overflow-x: hidden;
  font-weight: var(--font-weight-regular);
  min-width: 0;
  max-width: 100%;
`;

export const StaticPathWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  overflow-x: hidden;
  font-weight: var(--font-weight-regular);
  min-width: 0;
  max-width: 100%;
`;

export const HttpVerb = styled(Tag)`
  text-transform: uppercase;
  background-color: unset;
  border: none;
  padding: 0;
  margin: 0;
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  align-self: flex-end;
`;

export const PathLabel = styled.span`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  min-width: 0;
  line-height: var(--line-height-base);
  font-size: var(--font-size-base);
`;

export const ResponsePanelHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-xs);
  border-bottom: 1px solid var(--border-color-secondary);
`;

export const MediaTypeRow = styled.div`
  padding: 0 var(--spacing-md, 16px) var(--spacing-xs, 8px);
`;

export const DisabledMimeSelect = styled.select`
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: none;
  background-color: var(--panel-samples-dropdown-bg-color, rgba(255, 255, 255, 0.12));
  color: var(--panel-samples-text-color, #cfd8dc);
  border: var(--panel-samples-dropdown-border, 1px solid rgba(255, 255, 255, 0.2));
  border-radius: var(--border-radius-md, 6px);
  padding: var(--docs-dropdown-padding, 8px 12px);
  font-size: var(--docs-dropdown-font-size, 14px);
  line-height: var(--line-height-base, 1.5);
  opacity: 1;
  cursor: default;
`;

export const StyledSelectDropdown = styled(Dropdown)`
  > div {
    min-width: 100%;
    max-width: 100%;
  }
`;

export const SelectDropdownMenu = styled(DropdownMenu)`
  /* The portalled menu wrapper gets the trigger width as an inline min-width;
     width: 0 keeps the menu content from growing the wrapper past it, so the
     menu ends up exactly as wide as the trigger. */
  width: 0;
  min-width: 100%;
`;

export const SelectDropdownMenuItem = styled(DropdownMenuItem)`
  --dropdown-menu-item-justify-content: space-between;

  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xxs) var(--spacing-sm);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

export const SelectDropdownLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SelectDropdownCheckmarkIcon = styled(CheckmarkIcon)`
  width: 16px;
  height: 16px;
  margin-left: auto;
  flex-shrink: 0;
`;

export const SelectDropdownTriggerButton = styled(Button)`
  width: 100%;
  justify-content: space-between;
  background-color: var(--bg-color);
  color: var(--text-color-primary);
  border: var(--panel-samples-dropdown-border);
  border-radius: var(--border-radius-md);
  padding: var(--docs-dropdown-padding-vertical) var(--docs-dropdown-padding-left);
  font-size: var(--docs-dropdown-font-size, 14px);
  line-height: var(--line-height-base, 1.5);
  font-family: var(--font-family-base, inherit);

  &:hover,
  &:focus {
    background-color: var(--bg-color);
  }
`;

export const VariablesContainer = styled.div`
  border-top: 1px solid var(--border-color-secondary, rgba(255, 255, 255, 0.1));
  margin-top: var(--spacing-xs, 8px);
`;

export const VariablesTitle = styled.div`
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--panel-samples-text-color, #cfd8dc);
`;

export const ExampleDescriptionWrap = styled.div`
  margin: 0 var(--spacing-md) var(--spacing-sm);
`;

export const TryItPanelFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: var(--panel-border);
  padding: var(--spacing-xs) var(--spacing-md) var(--spacing-sm) var(--spacing-md);
`;
