import { memo } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ApiItem } from '../../types/store.js';

import { Menu } from '@redocly/theme/components/Menu/Menu';

import { useMenuItems } from './useMenuItems.js';
import { useSidebarItemTelemetry } from '../../telemetry/index.js';

type SideMenuProps = {
  items: ApiItem[];
  className?: string;
};

const SideMenuComponent = ({ items, className }: SideMenuProps): ReactElement => {
  const menuItems = useMenuItems({ items });
  const onMenuClick = useSidebarItemTelemetry();

  return (
    <MenuWrapper className={className} onClick={onMenuClick}>
      <Menu items={menuItems} />
    </MenuWrapper>
  );
};

export const SideMenu = memo<SideMenuProps>(SideMenuComponent);

const MenuWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;
