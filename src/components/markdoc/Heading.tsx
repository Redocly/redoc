import { createElement, memo } from 'react';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';

import type { JSX, PropsWithChildren } from 'react';

import { concatClassNames } from '@redocly/theme/core/utils';
import { HEADING_ANCHOR_CLASS, MARKDOWN_CLASS_NAME } from '@redocly/theme/core/constants';

import { DeepLinkAnchor, deepLinkHoverReveal } from '../common/DeepLinkAnchor.js';
import { joinWithSeparator } from '../../utils/url.js';
import { routingBasePathAtom } from '../../jotai/store.js';
import { useNavigationUrlNormalizer } from '../../hooks/useNormalizeUrl.js';

function HeadingComponent({
  level,
  id,
  children,
  deepLinkHash,
  'data-source': dataSource,
  'data-hash': dataHash,
  className,
}: PropsWithChildren<{
  level: number;
  id?: string;
  deepLinkHash?: string;
  'data-source'?: string;
  'data-hash'?: string;
  className?: string;
}>): JSX.Element {
  const routingBasePath = useAtomValue(routingBasePathAtom);
  const normalizeUrl = useNavigationUrlNormalizer();
  const headingId = id?.toLowerCase();
  return createElement(
    `h${level}`,
    {
      id: headingId,
      className: concatClassNames(HEADING_ANCHOR_CLASS, MARKDOWN_CLASS_NAME, className),
      'data-component-name': 'Markdoc/Heading/Heading',
      'data-source': dataSource,
      'data-hash': dataHash,
    },
    <HeadingContentWrapper>
      {headingId && (
        <DeepLinkAnchor
          to={normalizeUrl(joinWithSeparator(routingBasePath, deepLinkHash ?? headingId))}
          label={`link to ${id}`}
        />
      )}
      <span>{children}</span>
    </HeadingContentWrapper>,
  );
}

const HeadingContentWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  ${deepLinkHoverReveal}
`;

export const Heading = memo(HeadingComponent);
