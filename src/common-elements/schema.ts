import styled from '../styled-components';
import { darken } from 'polished';
import { deprecatedCss } from './mixins';

export const OneOfList = styled.div`
  margin: 0 0 3px 0;
  display: inline-block;
`;

export const OneOfLabel = styled.span`
  font-size: 0.9em;
  margin-right: 10px;
  color: ${props => props.theme.colors.primary.main};
  font-family: ${props => props.theme.typography.headings.fontFamily};
}
`;

export const OneOfButton = styled.button<{ $active: boolean; $deprecated: boolean }>`
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 5px;
  font-size: 0.8em;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.primary.main};
  padding: 2px 10px;
  line-height: 1.5em;
  outline: none;
  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.colors.primary.main};
  }

  ${({ $deprecated }) => ($deprecated && deprecatedCss) || ''};

  ${props => {
    if (props.$active) {
      return `
      color: white;
      background-color: ${props.theme.colors.primary.main};
      &:focus {
        box-shadow: none;
        background-color: ${darken(0.15, props.theme.colors.primary.main)};
      }
      `;
    } else {
      return `
        color: ${props.theme.colors.primary.main};
        background-color: white;
      `;
    }
  }}
`;

export const ArrayOpenningLabel = styled.div`
  font-size: 0.9em;
  font-family: ${props => props.theme.typography.code.fontFamily};
  &::after {
    content: ' [';
  }
`;

export const ArrayClosingLabel = styled.div`
  font-size: 0.9em;
  font-family: ${props => props.theme.typography.code.fontFamily};
  &::after {
    content: ']';
  }
`;
