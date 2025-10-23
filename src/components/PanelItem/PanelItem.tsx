import type { ReactNode } from 'react';

import { PanelItemWrap, Item, Header, Title, ActionsWrap, StyledCheckmarkIcon } from './styled.js';

export interface PanelItemProps {
  header?: string | ReactNode;
  title?: string | ReactNode;
  actions?: any[];
  active?: boolean;
  withCheckmark?: boolean;
}

export const PanelItem = ({ header, title, actions, active, withCheckmark }: PanelItemProps) => {
  return (
    <PanelItemWrap>
      <Item>
        {header && (typeof header === 'string' ? <Header>{header}</Header> : header)}
        <Title active={active} suppressHydrationWarning>
          {withCheckmark && active && <StyledCheckmarkIcon />} {title}
        </Title>
      </Item>
      <ActionsWrap>{actions?.map((action) => action)}</ActionsWrap>
    </PanelItemWrap>
  );
};
