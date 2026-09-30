import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styled, css, keyframes } from 'styled-components';
import { Link } from 'react-router';
import { useUrlHash } from '../../hooks/useUrlHash.js';
import { useAtomValue } from 'jotai';

import type { ReactElement, MouseEvent, PointerEvent, FocusEvent } from 'react';

import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { globalOptionsAtom } from '../../jotai/store.js';
import { hashToElementId } from '../../utils/deep-link.js';
import { useTranslate } from '../../hooks/useTranslate.js';

/** Keeps the tooltip from flashing while the pointer crosses the page. */
const TOOLTIP_HOVER_DELAY_MS = 500;
/** Lets the pointer cross the gap between the icon and the tooltip. */
const TOOLTIP_LEAVE_GRACE_MS = 100;
/** Tooltip height plus its offset from the icon; below this much room under the header it flips. */
const TOOLTIP_ROOM_PX = 48;

type TooltipPosition = { x: number; y: number; placement: 'top' | 'bottom' };

export type DeepLinkAnchorVariant = 'heading' | 'field';

export interface DeepLinkAnchorProps {
  /** Full link target (path + hash), also used as the element id */
  to: string;
  /** Accessible label */
  label?: string;
  variant?: DeepLinkAnchorVariant;
}

function DeepLinkAnchorComponent({
  to,
  label,
  variant = 'heading',
}: DeepLinkAnchorProps): ReactElement {
  const { onDeepLinkClick } = useAtomValue(globalOptionsAtom);
  const hash = useUrlHash({ trackSilentReplaces: true });

  const targetHash = to.split('#')[1];
  const isActive = !!targetHash && hashToElementId(hash) === hashToElementId(targetHash);

  const iconRef = useRef<HTMLSpanElement>(null);
  const [tooltipAt, setTooltipAt] = useState<TooltipPosition | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isTooltipOpen = tooltipAt !== null;

  const openTooltip = useCallback((delayMs: number) => {
    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => {
      const iconEl = iconRef.current;
      if (!iconEl) return;
      const icon = iconEl.getBoundingClientRect();
      const x = icon.left + icon.width / 2;
      setTooltipAt(
        icon.top - headerBottom(iconEl) < TOOLTIP_ROOM_PX
          ? { x, y: icon.bottom, placement: 'bottom' }
          : { x, y: icon.top, placement: 'top' },
      );
    }, delayMs);
  }, []);

  const closeTooltip = useCallback(() => {
    clearTimeout(tooltipTimer.current);
    setTooltipAt(null);
  }, []);

  const closeTooltipSoon = useCallback(() => {
    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setTooltipAt(null), TOOLTIP_LEAVE_GRACE_MS);
  }, []);

  useEffect(() => () => clearTimeout(tooltipTimer.current), []);

  // WCAG 1.4.13: content that appears on hover must be dismissible without moving the pointer.
  // The tooltip is fixed-positioned, so it also closes when the page scrolls under it.
  useEffect(() => {
    if (!isTooltipOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTooltip();
    };
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', closeTooltip, { capture: true, passive: true });
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', closeTooltip, { capture: true });
    };
  }, [isTooltipOpen, closeTooltip]);

  // The tooltip renders in a portal but stays in this React subtree, so moving the pointer
  // onto it counts as staying inside the link.
  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      if (e.pointerType !== 'mouse') return;
      if (isTooltipOpen) {
        clearTimeout(tooltipTimer.current);
      } else {
        openTooltip(TOOLTIP_HOVER_DELAY_MS);
      }
    },
    [isTooltipOpen, openTooltip],
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLAnchorElement>) => {
      if (isFocusVisible(e.currentTarget)) openTooltip(0);
    },
    [openTooltip],
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      closeTooltip();
      if (onDeepLinkClick) {
        e.preventDefault();
        onDeepLinkClick(to);
      }
    },
    [onDeepLinkClick, to, closeTooltip],
  );

  return (
    <AnchorWrapper className="deep-link-anchor" data-deep-link-anchor>
      <StyledLink
        $variant={variant}
        to={to}
        state={{ smoothScroll: true }}
        aria-label={label ?? `link to ${to}`}
        aria-current={isActive ? 'location' : undefined}
        data-tooltip-open={isTooltipOpen || undefined}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={closeTooltipSoon}
        onFocus={handleFocus}
        onBlur={closeTooltip}
      >
        <IconBox ref={iconRef}>
          <LinkIcon color="--heading-anchor-color" />
        </IconBox>
        {tooltipAt ? <DeepLinkTooltip at={tooltipAt} /> : null}
      </StyledLink>
    </AnchorWrapper>
  );
}

/** Mounted only while open, so the hundreds of closed anchors on a page skip `useTranslate`.
 *  Lazy sections use `content-visibility: auto`, which clips descendants to the section box,
 *  so the tooltip renders in `document.body`. */
function DeepLinkTooltip({ at }: { at: TooltipPosition }): ReactElement {
  const translate = useTranslate();
  return createPortal(
    <Tooltip
      aria-hidden="true"
      data-testid="deep-link-tooltip"
      data-placement={at.placement}
      $placement={at.placement}
      style={{ left: at.x, top: at.y }}
    >
      {translate('openapi.deepLink.tooltip', 'Link to this section')}
    </Tooltip>,
    document.body,
  );
}

/** `--navbar-stack-height` can hold a `calc()`, so the browser resolves it through a probe. */
function headerBottom(element: Element): number {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;height:calc(var(--navbar-stack-height, 0px) + var(--banner-height, 0px))';
  element.appendChild(probe);
  const height = probe.offsetHeight;
  probe.remove();
  return height;
}

function isFocusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
}

export const DeepLinkAnchor = memo(DeepLinkAnchorComponent);

/** Marks the deep-link control for {@link deepLinkHoverReveal} (avoid hiding other header SVGs). */
export const DEEP_LINK_ANCHOR_ATTR = 'data-deep-link-anchor';

/**
 * CSS mixin to reveal deep link anchor icons on parent hover.
 * Apply this to styled components that contain a DeepLinkAnchor.
 * Only targets SVGs inside `[data-deep-link-anchor]` so sibling icons (e.g. PageActions) stay visible.
 */
export const deepLinkHoverReveal = `
  & [${DEEP_LINK_ANCHOR_ATTR}] svg {
    visibility: hidden;
  }
  &:hover [${DEEP_LINK_ANCHOR_ATTR}] svg,
  & [${DEEP_LINK_ANCHOR_ATTR}] a:focus svg {
    visibility: visible;
  }
`;

const AnchorWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
`;

const StyledLink = styled(Link)<{ $variant: DeepLinkAnchorVariant }>`
  position: absolute;
  top: 50%;
  transform: translate(-100%, -50%);
  z-index: 1;
  display: flex;
  align-items: center;
  min-width: 24px;
  min-height: 24px;
  justify-content: flex-end;

  ${({ $variant }) =>
    $variant === 'field'
      ? css`
          left: -2px;
        `
      : css`
          left: 0;
          padding-right: var(--heading-anchor-offset-right, 4px);
        `}

  &:hover svg path:first-of-type {
    fill: var(--deep-link-anchor-bg-color-hover, var(--button-bg-color-secondary-hover));
  }

  &:active svg path:first-of-type {
    fill: var(--deep-link-anchor-bg-color-pressed, var(--button-bg-color-secondary-pressed));
  }

  &&[aria-current] svg,
  &&[data-tooltip-open] svg {
    visibility: visible;
  }

  &&[aria-current] svg path:first-of-type {
    fill: var(--deep-link-anchor-bg-color-current, var(--color-blueberry-1));
  }

  &&[aria-current] svg path:last-of-type {
    fill: var(--deep-link-anchor-color-current, var(--color-blueberry-6));
  }
`;

const IconBox = styled.span`
  display: flex;
`;

const tooltipFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Tooltip = styled.span<{ $placement: TooltipPosition['placement'] }>`
  position: fixed;
  z-index: var(--z-index-overlay);
  transform: ${({ $placement }) =>
    $placement === 'top' ? 'translate(-50%, calc(-100% - 8px))' : 'translate(-50%, 8px)'};
  padding: var(--tooltip-padding);
  border: var(--tooltip-border-width, 2px) var(--tooltip-border-style, solid)
    var(--tooltip-border-color, transparent);
  border-radius: var(--border-radius-lg);
  background: var(--tooltip-bg-color);
  color: var(--tooltip-text-color);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
  white-space: nowrap;
  animation: ${tooltipFadeIn} 150ms ease-out;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 16px;
    height: 8px;
    ${({ $placement }) =>
      $placement === 'top'
        ? css`
            bottom: 0;
            transform: translate(-50%, 100%);
          `
        : css`
            top: 0;
            transform: translate(-50%, -100%) rotate(180deg);
          `}
    clip-path: path('M0 0H16L9.414 6.586A2 2 0 0 1 6.586 6.586Z');
    background: var(--tooltip-arrow-color, var(--tooltip-bg-color));
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
