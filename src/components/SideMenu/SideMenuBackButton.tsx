import * as React from 'react';
import {
  MenuItemLabel,
  MenuItemLi,
  MenuItemTitle,
  MenuItemUl,
  MenuLink,
  MenuBreak,
} from './styled.elements';

interface SideMenuBackButtonProps {
  backNavigationPath?: string;
  siteTitle?: string;
}

const DEFAULT_NAVIGATION_PATH = 'https://mongodb.com/docs/';

export const SideMenuBackButton = ({ backNavigationPath, siteTitle }: SideMenuBackButtonProps) => {
  // Depth of menu item can dictate the styling of the component
  const depth = 1;
  const href = backNavigationPath ?? DEFAULT_NAVIGATION_PATH;
  const text = `Back to ${siteTitle ?? ''} Docs`;

  return (
    <>
      <MenuItemUl expanded={true}>
        <MenuItemLi depth={depth}>
          <MenuLink href={href}>
            <MenuItemLabel depth={depth} active={false} isBackButton={true}>
              <MenuItemTitle>&#8592; {text}</MenuItemTitle>
            </MenuItemLabel>
          </MenuLink>
        </MenuItemLi>
      </MenuItemUl>
      <MenuBreak />
    </>
  );
};
