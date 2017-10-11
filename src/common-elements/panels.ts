import styled from 'styled-components';

export const MiddlePanel = styled.div`
  width: ${props => 100 - props.theme.rightPanel.width}%;
  padding: ${props => props.theme.spacingUnit * 2}px;
`;

export const RightPanel = styled.div`
  width: ${props => props.theme.rightPanel.width}%;
  color: #fafbfc;
  bckground-color: ${props => props.theme.rightPanel.backgroundColor};
  padding: ${props => props.theme.spacingUnit * 2}px;
`;
