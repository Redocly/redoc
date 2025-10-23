import type { IMenuItem } from '../../services/index.js';

export interface MenuItemLinkProps {
  depth: number;
  active: boolean;
  deprecated?: boolean;
  type?: string;
  hasChildren?: boolean;
  to: string;
  href?: string;
  onClick?: () => void;
}

export type ExtendedMenuItem = IMenuItem & {
  active: boolean;
  hasActiveSubItem: boolean;
  items: ExtendedMenuItem[];
};
