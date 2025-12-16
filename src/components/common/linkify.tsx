import { useAtomValue } from 'jotai';
import { Link as LinkRouter } from 'react-router-dom';

import type { PropsWithChildren, ReactElement } from 'react';

import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { globalOptionsAtom } from '../../jotai/store.js';
import { tryDecodeURIComponent } from '../../utils/index.js';
import { styled } from '../../styled-components.js';
import { joinWithSeparator } from '../../services/history/helpers.js';

export function Link(
  props: PropsWithChildren<{
    to: string;
    className?: string;
    id?: string;
    'aria-label'?: string;
  }>,
): ReactElement | null {
  const { routingBasePath } = useAtomValue(globalOptionsAtom);

  const link = props.to;

  return link ? (
    <LinkRouter
      aria-label={props['aria-label'] || `link to ${link}`}
      id={tryDecodeURIComponent(props.id || '')}
      className={props.className || ''}
      to={link?.startsWith('#') ? link : joinWithSeparator(routingBasePath || '', link)}
    >
      {props.children}
    </LinkRouter>
  ) : props.children ? (
    <span aria-label={props['aria-label'] || `link to ${link}`} className={props.className}>
      {' '}
      {props.children}{' '}
    </span>
  ) : null;
}

export const StyledShareLink = styled(Link)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-100%, -50%);
  padding-right: var(--heading-anchor-offset-right);
  z-index: 1;

  ${LinkIcon} {
    opacity: 0;
    transition:
      visibility 0.3s linear,
      opacity 0.3s linear;
  }

  :hover ${LinkIcon}, :focus ${LinkIcon} {
    visibility: visible;
    opacity: 1;
  }
`;

export function ShareLink(props): ReactElement {
  return (
    <StyledShareLink {...props}>
      <LinkIcon size="13px" color="--heading-anchor-color" />
    </StyledShareLink>
  );
}
