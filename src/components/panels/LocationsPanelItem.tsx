import type { ReactElement } from 'react';
import type { LocationsPanelNode } from '../../types/content.js';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { resolveText } from '../../utils/resolveText.js';
import {
  PanelWrapper,
  PanelHeading,
  PanelBody,
  PanelListItem,
  ListIcon,
} from './shared-panel-styles.js';

export function LocationsPanelItem({ node }: { node: LocationsPanelNode }): ReactElement | null {
  const locationItem = node.children[0];
  const translate = useSpecTranslate();
  const locations = locationItem?.locations ?? [];

  if (locations.length === 0) return null;

  const panelHeader = resolveText(translate, node.titleTranslationKey, node.title);

  return (
    <PanelWrapper className="panel-api-docs">
      <PanelHeading>{panelHeader}</PanelHeading>
      <PanelBody>
        {locations.map((location) => (
          <PanelListItem data-testid="location-item" key={location}>
            <ListIcon />
            {location}
          </PanelListItem>
        ))}
      </PanelBody>
    </PanelWrapper>
  );
}
