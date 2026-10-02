import { Fragment, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';
import { trimText } from '@redocly/theme/core/openapi';

import { calculateMaxLength } from '../../utils/calculateMaxLength.js';

const DEFAULT_MAX_LENGTH = 25;
const COLLAPSE_THRESHOLD = 3;
const PAGE_ACTIONS_GAP = 16;

export type Breadcrumb = {
  name: string;
  href: string;
};

type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
  onClick: (href: string) => void;
};

function BreadcrumbLink({
  breadcrumb,
  onClick,
  maxLength,
}: {
  breadcrumb: Breadcrumb;
  onClick: (href: string) => void;
  maxLength: number;
}): ReactElement {
  const isTruncated = breadcrumb.name.length > maxLength;
  const displayLabel = trimText(breadcrumb.name, maxLength);

  return (
    <Tooltip tip={breadcrumb.name} placement="bottom" disabled={!isTruncated}>
      <BreadcrumbButton onClick={() => onClick(breadcrumb.href)}>{displayLabel}</BreadcrumbButton>
    </Tooltip>
  );
}

function CollapsedBreadcrumbs({
  breadcrumbs,
  onClick,
  maxLength,
}: {
  breadcrumbs: Breadcrumb[];
  onClick: (href: string) => void;
  maxLength: number;
}): ReactElement {
  const first = breadcrumbs[0];
  const last = breadcrumbs[breadcrumbs.length - 1];
  const middle = breadcrumbs.slice(1, -1);

  return (
    <>
      <BreadcrumbLink breadcrumb={first} onClick={onClick} maxLength={maxLength} />
      <BreadcrumbSeparator>/</BreadcrumbSeparator>
      <Dropdown
        trigger={<BreadcrumbDropdownTrigger>...</BreadcrumbDropdownTrigger>}
        closeOnClick
        alignment="end"
      >
        <DropdownMenu>
          {middle.map((b) => (
            <DropdownMenuItem key={b.href} onAction={() => onClick(b.href)}>
              {b.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <BreadcrumbSeparator>/</BreadcrumbSeparator>
      <BreadcrumbLink breadcrumb={last} onClick={onClick} maxLength={maxLength} />
    </>
  );
}

function FullBreadcrumbs({
  breadcrumbs,
  onClick,
  maxLength,
}: {
  breadcrumbs: Breadcrumb[];
  onClick: (href: string) => void;
  maxLength: number;
}): ReactElement {
  return (
    <>
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={breadcrumb.href}>
          <BreadcrumbLink breadcrumb={breadcrumb} onClick={onClick} maxLength={maxLength} />
          {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
        </Fragment>
      ))}
    </>
  );
}

export function Breadcrumbs({ breadcrumbs, onClick }: BreadcrumbsProps): ReactElement | null {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const [maxLength, setMaxLength] = useState<number>(DEFAULT_MAX_LENGTH);

  const shouldCollapse = breadcrumbs.length > COLLAPSE_THRESHOLD;

  const displayBreadcrumbs = useMemo(
    () => (shouldCollapse ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]] : breadcrumbs),
    [breadcrumbs, shouldCollapse],
  );

  const updateMaxLength = useCallback((): void => {
    const wrapper = wrapperRef.current;
    const parent = wrapper?.parentElement;
    if (!wrapper || !parent || !measureRef.current) return;

    // clientWidth includes the parent's horizontal padding, but the breadcrumb
    // sits inside the content box — exclude the padding so we don't overestimate
    // the space and under-truncate (causing overflow on narrow screens).
    const style = getComputedStyle(parent);
    const horizontalPadding =
      parseFloat(style.paddingLeft || '0') + parseFloat(style.paddingRight || '0');
    let availableWidth = parent.clientWidth - horizontalPadding;

    // The breadcrumb shares the header area with the page actions (Copy button)
    // that sit to its right. Stop before them so the breadcrumb never overruns
    // the button.
    const pageActions = parent.parentElement?.querySelector<HTMLElement>(
      '[data-component-name="PageActions/PageActions"]',
    );
    if (pageActions) {
      const widthToActions =
        pageActions.getBoundingClientRect().left -
        wrapper.getBoundingClientRect().left -
        PAGE_ACTIONS_GAP;
      if (widthToActions > 0) availableWidth = Math.min(availableWidth, widthToActions);
    }

    const newMaxLength = calculateMaxLength(
      displayBreadcrumbs,
      availableWidth,
      shouldCollapse,
      measureRef.current,
    );

    setMaxLength(newMaxLength);
  }, [displayBreadcrumbs, shouldCollapse]);

  useLayoutEffect(() => {
    updateMaxLength();

    const observer = new ResizeObserver(updateMaxLength);
    const parent = wrapperRef.current?.parentElement;

    if (parent) {
      observer.observe(parent);
    }

    return () => {
      observer.disconnect();
    };
  }, [updateMaxLength]);

  if (!breadcrumbs.length) {
    return null;
  }

  return (
    <>
      <MeasureElement ref={measureRef} aria-hidden="true" />
      <BreadcrumbsWrapper ref={wrapperRef} data-component-name="Breadcrumbs">
        {shouldCollapse ? (
          <CollapsedBreadcrumbs breadcrumbs={breadcrumbs} onClick={onClick} maxLength={maxLength} />
        ) : (
          <FullBreadcrumbs breadcrumbs={breadcrumbs} onClick={onClick} maxLength={maxLength} />
        )}
      </BreadcrumbsWrapper>
    </>
  );
}

const MeasureElement = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  font-size: var(--font-size-sm);
`;

const BreadcrumbsWrapper = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--spacing-xxs);
  max-width: 100%;
  /* No overflow: hidden here — it would clip the collapsed "..." dropdown menu,
     which the theme Dropdown renders inline (absolute, not portaled). Truncation
     is handled per-crumb via trimText + the button's text-overflow: ellipsis. */
`;

const BreadcrumbButton = styled.button`
  background: none;
  border: none;
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-secondary);
  border-radius: var(--breadcrumbs-border-radius);
  cursor: pointer;
  padding: 1px calc(var(--spacing-xxs) / 2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 1 auto;
  min-width: 0;

  &:hover {
    color: var(--text-color-primary);
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  line-height: var(--line-height-sm);
  padding: 0 calc(var(--spacing-xxs) / 2);
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
`;

const BreadcrumbDropdownTrigger = styled(BreadcrumbButton)`
  text-align: center;
  overflow: visible;
`;
