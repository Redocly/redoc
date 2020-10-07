import styled from '../../styled-components';
import { InvertedSimpleDropdown } from '../PayloadSamples/styled.elements';
import { darken } from 'polished';

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SamplesDropdown = styled(InvertedSimpleDropdown)`
  && {
    background-color: ${({ theme }) => theme.codeBlock.backgroundColor};
    height: 33px;
    padding: 6px 10px;
    border: 1px solid ${({ theme }) => darken(0.05, theme.codeBlock.backgroundColor)};
    border-radius: 5px;
    &:hover,
    &:focus-within {
      border: 1px solid ${({ theme }) => darken(0.05, theme.codeBlock.backgroundColor)};
      box-shadow: none;
    }
    &:focus-within {
      background-color: ${({ theme }) => theme.codeBlock.backgroundColor};
    }
  }
`;
