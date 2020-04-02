import styled from '../../styled-components';
import { CallbackTitle } from './CallbackTitle';

// TODO: get 'background-color' from theme
// e.g. "theme.colors.secondary.main" or "theme.colors.callbacks.background.main"
export const StyledCallbackTitle = styled(CallbackTitle)`
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 4px;
  line-height: 1.5em;
  background-color: #f2f2f2;
  cursor: pointer;
`;

// TODO: get 'background-color' from theme
// e.g. "theme.colors.secondary.light" or "theme.colors.callbacks.background.light"
export const CallbackDetailsWrap = styled.div`
  padding: 10px 25px;
  background-color: #fafafa;
  margin-bottom: 5px;
  margin-top: 5px;
`;
