import { SECTION_ATTR } from '../services/MenuStore';
import styled, { media, withProps } from '../styled-components';

export const MiddlePanel = styled.div`
  width: calc(100% - ${props => props.theme.rightPanel.width});
  padding: 0 ${props => props.theme.spacing.sectionHorizontal}px;

  ${media.lessThan('medium')`
    width: 100%;
  `};
`;

export const Section = withProps<{ underlined?: boolean }>(
  styled.div.attrs({
    [SECTION_ATTR]: props => props.id,
  } as any),
)`
  padding: ${props => props.theme.spacing.sectionVertical}px 0;

  ${props =>
    (props.underlined &&
      `
    position: relative;

    &:not(:last-of-type):after {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: block;
      content: '';
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
  `) ||
    ''}
`;

export const RightPanel = styled.div`
  width: ${props => props.theme.rightPanel.width};
  color: #fafbfc;
  background-color: ${props => props.theme.rightPanel.backgroundColor};
  padding: 0 ${props => props.theme.spacing.sectionHorizontal}px;

  ${media.lessThan('medium')`
    width: 100%;
  `};
`;

export const DarkRightPanel = styled(RightPanel)`
  background-color: ${props => props.theme.rightPanel.backgroundColor};
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
  padding: 0;

  ${media.lessThan('medium')`
    flex-direction: column;
  `};
`;
