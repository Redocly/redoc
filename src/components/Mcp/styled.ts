import { styled } from 'styled-components';

import { H4 } from '@redocly/theme/components/Typography/H4';

import { deepLinkHoverReveal } from '../common/DeepLinkAnchor.js';

export const McpSection = styled.section`
  padding-bottom: calc(var(--spacing-base) * 2);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
`;

export const McpSubRow = styled.div`
  margin: calc(var(--spacing-unit) * 2) 0;

  & + & {
    margin-top: calc(var(--spacing-base) * 2);
  }
`;

export const McpRowLine = styled.div`
  margin: 1em 0;
`;

export const McpTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  ${deepLinkHoverReveal}
`;

export const McpTitle = styled(H4)`
  margin: 0;
`;
