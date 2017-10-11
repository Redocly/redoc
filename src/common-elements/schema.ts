import styled from '../styled-components';
import { withProps } from '../styled-components';

export const OneOfList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: inline-block;
`;

export const OneOfLabel = styled.span`
  font-size: 0.9em;
  margin-right: 10px;
  color: ${props => props.theme.colors.main};
  font-family: Montserrat;
}
`;

export const OneOfButton = withProps<{ active: boolean }>(styled.li)`
  display: inline-block;
  margin-right: 10px;
  font-size: 0.8em;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.main};
  padding: 2px 10px;

  ${props => {
    if (props.active) {
      return `
      color: white;
      background-color: ${props.theme.colors.main};
      `;
    } else {
      return `
        color: ${props.theme.colors.main};
        background-color: white;
      `;
    }
  }}
`;

export const ArrayOpenningLabel = styled.div`
  font-size: 0.9em;
  font-family: ${props => props.theme.code.fontFamily};
  &::after {
    content: ' [';
  }
`;

export const ArrayClosingLabel = styled.div`
  font-size: 0.9em;
  font-family: ${props => props.theme.code.fontFamily};
  &::after {
    content: ']';
  }
`;
