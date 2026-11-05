import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Portal } from '@redocly/theme/components/Portal/Portal';
import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';

import { BodyPortal, NestedPortalScope, PortalScope } from '../BodyPortal.js';

describe('PortalScope', () => {
  it('mounts theme portals in a body-level Redoc root', async () => {
    render(
      <PortalScope>
        <Portal>Switch color mode</Portal>
      </PortalScope>,
    );

    await waitFor(() => {
      const root = screen.getByText('Switch color mode').closest('.redoc');
      expect(root?.parentElement).toBe(document.body);
      expect(root?.className).toMatch(/\bredoc (light|dark)\b/);
    });
  });

  it('mounts theme portals opened in a body-level dialog after that dialog', async () => {
    render(
      <PortalScope>
        <BodyPortal>
          <div>Security</div>
          <Portal>read:organization_settings</Portal>
        </BodyPortal>
      </PortalScope>,
    );

    await waitFor(() => {
      const dialog = screen.getByText('Security');
      const tooltip = screen.getByText('read:organization_settings');
      expect(tooltip.closest('.redoc')).toBe(dialog.closest('.redoc'));
      expect(
        dialog.compareDocumentPosition(tooltip) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
  });

  it('mounts theme portals opened in a portalled menu inside the menu, after its content', async () => {
    render(
      <PortalScope>
        <Dropdown portalled trigger={<button type="button">Discriminator</button>}>
          <NestedPortalScope>
            <DropdownMenu>
              <span>Default mapping</span>
              <Portal>
                <span>defaultMapping tooltip</span>
              </Portal>
            </DropdownMenu>
          </NestedPortalScope>
        </Dropdown>
      </PortalScope>,
    );

    fireEvent.click(screen.getByText('Discriminator'));

    await waitFor(() => {
      const menu = screen
        .getByText('Default mapping')
        .closest('[data-component-name="Dropdown/DropdownMenu"]')?.parentElement;
      expect(screen.getByText('defaultMapping tooltip').parentElement).toBe(menu?.lastElementChild);
    });
  });
});
