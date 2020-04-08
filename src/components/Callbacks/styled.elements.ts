import styled from '../../styled-components';
import { CallbackTitle } from './CallbackTitle';

export const StyledCallbackTitle = styled(CallbackTitle)`
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 4px;
  line-height: 1.5em;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;
`;

export const CallbackDetailsWrap = styled.div`
  padding: 10px 25px;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  margin-bottom: 5px;
  margin-top: 5px;
`;
