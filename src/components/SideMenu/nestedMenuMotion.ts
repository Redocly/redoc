/**
 * Nested sidebar groups animate their height in `@redocly/theme` (`useCollapse`).
 * These helpers cover the behavior that animator does not:
 * - the empty inline style it leaves for one frame before measuring height
 * - `prefers-reduced-motion`
 * - `aria-hidden` on a fully collapsed nested panel
 *
 * The root list keeps the theme's native list semantics.
 */

export const NESTED_MENU_PANEL_SELECTOR =
  '[data-component-name="Menu/MenuItem"].menu-item-type-group > div';

/**
 * Clamps the pre-measure frame (inline `style=""`) so the panel does not flash
 * open, and skips the height transition when the user prefers reduced motion.
 * Collapsed panels stay `display: none`, which wins over `height: auto`.
 */
export const NESTED_MENU_MOTION_CSS = `
  [data-component-name='Menu/MenuItem'].menu-item-type-group > div[style=''] {
    height: 0 !important;
    overflow: hidden !important;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-component-name='Menu/MenuItem'].menu-item-type-group > div[style=''],
    [data-component-name='Menu/MenuItem'].menu-item-type-group > div[style*='height:'] {
      transition: none !important;
      height: auto !important;
      overflow: visible !important;
    }
  }
`;

/** A nested panel is hidden once the theme has finished collapsing it. */
export function isNestedMenuCollapsed(panel: HTMLElement): boolean {
  return panel.style.display === 'none';
}

export function syncNestedMenuA11y(root: ParentNode): void {
  const panels = root.querySelectorAll<HTMLElement>(NESTED_MENU_PANEL_SELECTOR);
  for (const panel of panels) {
    if (isNestedMenuCollapsed(panel)) {
      if (panel.getAttribute('aria-hidden') !== 'true') {
        panel.setAttribute('aria-hidden', 'true');
      }
    } else if (panel.hasAttribute('aria-hidden')) {
      panel.removeAttribute('aria-hidden');
    }
  }
}
