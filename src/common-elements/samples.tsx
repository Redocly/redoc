import styled from '../styled-components';
import { PrismDiv } from './PrismDiv';

export const SampleControls = styled.div`
  opacity: 0.4;
  transition: opacity 0.3s ease;
  text-align: right;

  > span {
    display: inline-block;
    padding: 2px 10px;
    cursor: pointer;

    :hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const SampleControlsWrap = styled.div`
  &:hover ${SampleControls} {
    opacity: 1;
  }
`;

export const StyledPre = styled(PrismDiv.withComponent('pre'))`
  font-family: ${props => props.theme.typography.code.fontFamily};
  font-size: ${props => props.theme.typography.code.fontSize};
  overflow-x: auto;
  margin: 0;

  white-space: ${({ theme }) => (theme.typography.code.wrap ? 'pre-wrap' : 'pre')};
`;
