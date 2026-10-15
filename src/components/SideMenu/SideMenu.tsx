import { memo, useRef } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ApiItem } from '../../types/store.js';

import { Menu } from '@redocly/theme/components/Menu/Menu';

import { useMenuItems } from './useMenuItems.js';
import { useSidebarItemTelemetry } from '../../telemetry/index.js';
import { NESTED_MENU_MOTION_CSS } from './nestedMenuMotion.js';
import { useNestedMenuA11y } from './useNestedMenuA11y.js';

type SideMenuProps = {
  items: ApiItem[];
  className?: string;
};

const SideMenuComponent = ({ items, className }: SideMenuProps): ReactElement => {
  const menuItems = useMenuItems({ items });
  const onMenuClick = useSidebarItemTelemetry();
  const menuRef = useRef<HTMLDivElement>(null);
  useNestedMenuA11y(menuRef);

  return (
    <MenuWrapper ref={menuRef} className={className} onClick={onMenuClick}>
      <Menu items={menuItems} />
    </MenuWrapper>
  );
};

export const SideMenu = memo<SideMenuProps>(SideMenuComponent);

const MenuWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  ${NESTED_MENU_MOTION_CSS}
`;
