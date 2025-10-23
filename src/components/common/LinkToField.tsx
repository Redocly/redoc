import { css } from 'styled-components';

import type { PropsWithChildren, ReactElement } from 'react';
import type { FieldModel } from '../../models/types.js';

import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { encodeBackSlashes } from '../../utils/string.js';
import { constructFieldDeepFragment, joinWithSeparator } from '../../services/history/helpers.js';
import { ShareLink } from './linkify.js';
import { styled } from '../../styled-components.js';
import { useLocation } from '../../hooks/useLocation.js';

interface LinkToFieldProps {
  className?: string;
  to?: string;
}

export function generateDeepLink(field: FieldModel, activeMimeName?: string): string {
  const operation = field.deps.operation;
  const fieldFragment = constructFieldDeepFragment(field, activeMimeName);

  //Models doesnt have operation.id
  if (!operation?.id && !operation.isCallback) {
    return '#' + fieldFragment.toLowerCase();
  }

  const deepLink = joinWithSeparator(
    operation.href,
    joinWithSeparator(operation.id, fieldFragment),
    '#',
  );

  return encodeBackSlashes(deepLink.toLowerCase());
}

export const LinkToField = ({
  to,
  className,
}: PropsWithChildren<LinkToFieldProps>): ReactElement | null => {
  const deepLink = to;
  const location = useLocation();

  const hash = deepLink?.split('#')[1];
  const isActive = location ? location.hash === `#${hash}` : false;
  return (
    <ShareLinkToField
      ariaLabel={`link  to ${deepLink}`}
      className={className}
      isActive={isActive}
      to={deepLink}
      id={hash}
    />
  );
};

export const ShareLinkToField = styled(ShareLink)<{ isActive: boolean }>`
  display: flex;
  ${LinkIcon} {
    visibility: hidden;
    cursor: pointer;
    background-color: var(--bg-color);
  }

  ${({ isActive }) =>
    isActive &&
    css`
      ${LinkIcon} {
        visibility: visible;
        opacity: 1;
      }
    `}
  :hover ${LinkIcon}, :focus ${LinkIcon} {
    visibility: visible;
    opacity: 1;
  }
`;
