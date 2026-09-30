import { styled } from 'styled-components';

import type { ReactNode } from 'react';

import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';

export type PanelItemProps = {
  header?: string | ReactNode;
  title?: string | ReactNode;
  actions?: ReactNode[];
  active?: boolean;
  withCheckmark?: boolean;
  children?: ReactNode;
};

export const PanelItem = ({
  header,
  title,
  actions,
  active,
  withCheckmark,
  children,
}: PanelItemProps) => {
  return (
    <PanelItemWrapper>
      <Item>
        {header && (typeof header === 'string' ? <Header>{header}</Header> : header)}
        <Title $active={active} suppressHydrationWarning>
          {withCheckmark && active && <StyledCheckmarkIcon data-testid="panel-item-checkmark" />}{' '}
          {title}
        </Title>
        {children}
      </Item>
      <ActionsWrapper>{actions?.map((action) => action)}</ActionsWrapper>
    </PanelItemWrapper>
  );
};

export const PanelItemWrapper = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  position: relative;
  width: 100%;
`;

export const Item = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  flex: 1;
`;

export const Header = styled.span`
  text-align: left;
  color: var(--menu-content-title-color);
  font-size: var(--h6-font-size);
  line-height: var(--h6-line-height);
`;

export const Title = styled.div<{ $active?: boolean }>`
  margin: 0;
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: ${({ $active }) => $active && 'var(--font-weight-medium)'};
`;

export const ActionsWrapper = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

export const PanelItemsList = styled.div`
  & > span {
    border-bottom: 1px solid var(--border-color-secondary);
    margin-bottom: var(--spacing-xs);
    padding-bottom: var(--spacing-xs);
  }

  & > span:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const PanelItemDescription = styled.span`
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-medium);
`;

export const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  width: 14px;
  height: 14px;
  position: absolute;
  left: -18px;
  bottom: 3px;
`;

export const ServerTitleWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: var(--spacing-xxs);
`;

export const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
