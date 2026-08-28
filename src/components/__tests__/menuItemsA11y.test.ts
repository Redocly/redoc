/* tslint:disable:no-implicit-dependencies */

import { getMenuItemsA11yProps } from '../SideMenu/menuItemsA11y';

describe('getMenuItemsA11yProps', () => {
  it('returns menu role for root list', () => {
    expect(getMenuItemsA11yProps(true, false)).toEqual({ role: 'menu' });
  });

  it('hides collapsed nested list from assistive tech', () => {
    expect(getMenuItemsA11yProps(false, false)).toEqual({ 'aria-hidden': true });
  });

  it('keeps expanded nested list visible to assistive tech', () => {
    expect(getMenuItemsA11yProps(false, true)).toEqual({ 'aria-hidden': false });
  });
});
