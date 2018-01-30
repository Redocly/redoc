import styled, { media } from '../styled-components';

export const MiddlePanel = styled.div`
  width: ${props => 100 - props.theme.rightPanel.width}%;
  padding: ${props => props.theme.spacingUnit * 2}px;

  ${media.lessThan('medium')`
    width: 100%;
  `};
`;

export const RightPanel = styled.div`
  width: ${props => props.theme.rightPanel.width}%;
  color: #fafbfc;
  bckground-color: ${props => props.theme.rightPanel.backgroundColor};
  padding: ${props => props.theme.spacingUnit * 2}px;

  ${media.lessThan('medium')`
    width: 100%;
  `};
`;

export const DarkRightPanel = styled(RightPanel)`
  background-color: ${props => props.theme.rightPanel.backgroundColor};
`;

export const EmptyDarkRightPanel = styled(DarkRightPanel)`
  ${media.lessThan('medium')`
    padding: 0
  `};
`;

export const Row = styled.div`
  display: flex;
  width: 100%;

  ${media.lessThan('medium')`
    flex-direction: column;
  `};
`;
