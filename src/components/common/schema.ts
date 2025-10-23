import { css } from 'styled-components';

import { deprecatedCss } from './mixins.js';
import { styled } from '../../styled-components.js';

export const OneOfButton = styled.button<{ selected: boolean; deprecated: boolean }>`
  border: 1px solid var(--schema-buttons-border-color);
  height: 24px;
  border-radius: var(--border-radius);
  cursor: pointer;
  outline: none;
  font-family: var(--schema-buttons-font-family);
  font-weight: var(--schema-buttons-font-weight);
  font-size: var(--schema-buttons-font-size);
  line-height: 1em;
  color: var(--schema-buttons-text-color);
  background-color: var(--schema-buttons-bg-color);
  padding: 0 10px;
  min-width: 90px;
  transition:
    background-color 0.2s ease-in,
    border-color 0.2s ease-in;

  &:hover {
    background-color: var(--schema-buttons-bg-color-hover);
  }

  &:active {
    background-color: var(--schema-buttons-bg-color-active);
  }

  ${({ deprecated }) => deprecated && deprecatedCss};

  ${({ selected }) =>
    selected &&
    css`
      border-color: var(--schema-buttons-selected-border-color);
      background-color: var(--schema-buttons-selected-bg-color);
      color: var(--schema-buttons-selected-text-color);

      &:hover {
        background-color: var(--schema-buttons-selected-bg-color-hover);
      }
      &:active {
        background-color: var(--schema-buttons-active-hover-background-color);
      }
    `}
`;

export const OneOfList = styled.div`
  display: inline;

  flex-wrap: wrap;
  margin: 4px -3px;
  margin-left: 10px;

  ${OneOfButton} {
    margin: 2px;
  }
`;

export const Wrapper = styled.div`
  margin-bottom: 1em;
`;

export const SelectionTitle = styled.div`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--tag-basic-content-color);
  padding: 0 var(--spacing-xs);
  border: 1px solid var(--border-color-secondary);
  border-radius: var(--border-radius);
  margin: var(--spacing-xxs) 0 var(--spacing-xs);
  position: relative;
  width: fit-content;
  &:before {
    content: ' ';
    width: 1px;
    height: var(--spacing-xs);
    background: var(--border-color-secondary);
    display: block;
    position: absolute;
    bottom: calc(-1 * var(--spacing-xs));
    left: var(--spacing-xs);
  }
`;
