import { css } from 'styled-components';

import type { SelectProps } from './types.js';

import { ChevronDownIcon } from '@redocly/theme/icons/ChevronDownIcon/ChevronDownIcon';

import { Select as SelectComponent } from './Select.js';
import { styled } from '../../../styled-components.js';

const darkSelectStyle = css`
  background-color: var(--panel-samples-dropdown-bg-color);
  border: var(--panel-samples-dropdown-border);
  color: var(--panel-samples-dropdown-color);

  &,
  &:hover,
  &:focus-within {
    box-shadow: none;
  }
`;

export const Select = styled(SelectComponent)<
  SelectProps & {
    fullWidth?: boolean;
    variant?: 'dark' | 'light';
  }
>`
  box-sizing: border-box;
  outline: none;
  display: inline-block;
  vertical-align: bottom;
  position: relative;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  cursor: pointer;
  text-transform: none;

  label {
    box-sizing: border-box;
    min-width: 90px;
    height: 36px;
    outline: none;
    display: inline-block;
    color: var(--docs-dropdown-text-color);
    border-radius: var(--border-radius-md);
    padding: var(--docs-dropdown-padding);
    vertical-align: bottom;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    text-transform: none;
    line-height: inherit;
    font-size: var(--docs-dropdown-font-size);
    font-family: inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &,
    &:hover,
    &:focus-within {
      box-shadow: none;
    }

    ${({ variant }) => (variant === 'dark' ? darkSelectStyle : '')};
  }

  .dropdown-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border: none;
    appearance: none;
    cursor: pointer;

    color: var(--text-color-secondary);
    line-height: inherit;
    font-size: var(--font-size-base);
    font-family: inherit;
    padding: var(--docs-dropdown-padding);
    ${({ variant }) => (variant === 'dark' ? darkSelectStyle : '')};
  }
`;

export const SimpleSelect = styled(Select)`
  svg {
    top: 60%;
    transform: translateY(-60%);
  }
  label {
    padding: 0 26px 0 4px;
    background: transparent;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-regular);
    appearance: none;
    height: auto;

    &:hover,
    &:focus-within {
      box-shadow: none;
    }
  }
`;

export const Arrow = styled(ChevronDownIcon)`
  position: absolute;
  right: 10px;
  top: 10px;
`;
