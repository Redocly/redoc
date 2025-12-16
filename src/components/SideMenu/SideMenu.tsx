import { memo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { ExtendedMenuItem, IMenuItem } from '../../services/index.js';

import { Menu } from '@redocly/theme/components/Menu/Menu';

import { useMenuItems } from './hooks/useMenuItems.js';
import { styled } from '../../styled-components.js';
import { globalOptionsAtom } from '../../jotai/store.js';

interface SideMenuProps {
  items: (ExtendedMenuItem & IMenuItem)[];
  className?: string;
}

const SideMenuComponent = ({ items, className }: SideMenuProps): ReactElement => {
  const { routingBasePath } = useAtomValue(globalOptionsAtom);
  const menuItems = useMenuItems({ items, routingBasePath });
  return (
    <MenuWrapper className={className}>
      <Menu items={menuItems} />
    </MenuWrapper>
  );
};

export const SideMenu = memo<SideMenuProps>(SideMenuComponent);

export const MenuWrapper = styled.div`
  overflow: auto;
`;
