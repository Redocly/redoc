import { useContext } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { DeepLinkAnchor, deepLinkHoverReveal } from '../common/DeepLinkAnchor.js';
import { ExpandAllButton } from '../common/ExpandAllButton.js';
import { useHeaderExpandableKeys, useHeaderHasRenderedCollapsibles } from '../Header/hooks.js';
import { ItemIdContext } from '../../hooks/useDeepLinkSection.js';
import { getDeepLinkId } from '../../utils/deep-link.js';

interface SectionHeaderProps {
  label: string;
  deepLink: string;
  suffix: string;
}

export function SectionHeader({ label, deepLink, suffix }: SectionHeaderProps): ReactElement {
  const itemId = useContext(ItemIdContext);
  const expandableKeys = useHeaderExpandableKeys(suffix);
  const hasRenderedCollapsibles = useHeaderHasRenderedCollapsibles(suffix);

  return (
    <SectionLabelWrapper id={getDeepLinkId(deepLink)}>
      {deepLink && <DeepLinkAnchor to={deepLink} label={`link to ${label}`} />}
      <SectionLabel>{label}</SectionLabel>
      {expandableKeys.length > 0 && hasRenderedCollapsibles && itemId && (
        <ExpandAllButton itemId={itemId} deepLinkKeys={expandableKeys} />
      )}
    </SectionLabelWrapper>
  );
}

const SectionLabelWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: var(--spacing-xs);
  ${deepLinkHoverReveal}
`;

const SectionLabel = styled.h5`
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-lg);
  color: var(--text-color-primary);
  margin: 0 0 var(--spacing-xxs);
  padding: 0;
`;
