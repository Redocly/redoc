import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { PanelNodeProps } from './PanelNodeProps.js';
import type { OverviewNode } from '../../types/content.js';

import { CopyButton } from '@redocly/theme/components/Buttons/CopyButton';
import { NewTabButton } from '@redocly/theme/components/Buttons/NewTabButton';
import { EmailButton } from '@redocly/theme/components/Buttons/EmailButton';

import { panelKind } from '../../types/common.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { resolveText } from '../../utils/resolveText.js';
import { PanelItem, PanelItemDescription, PanelItemsList } from '../common/PanelItem.js';
import { OverviewPanel } from './styled.js';

export function OverviewPanelItem({ node }: PanelNodeProps): ReactElement | null {
  const panel = node as OverviewNode;
  const translate = useSpecTranslate();
  const renderedItems = panel.children
    .map((item, index) => {
      const itemTitle = resolveText(translate, item.titleTranslationKey, item.title);
      const itemLabel = resolveText(translate, item.labelTranslationKey, item.label);
      if (item.kind === panelKind.EXTERNAL_LINK) {
        return (
          <PanelItem
            key={`${item.url}-${index}`}
            header={
              item.title ? <PanelItemDescription>{itemTitle}</PanelItemDescription> : undefined
            }
            title={
              <LinkWrapper>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {itemLabel}
                </a>
              </LinkWrapper>
            }
            actions={[
              ...(item.withCopyButton
                ? [<CopyButton data={item.copyContent || item.url} key={`copy-${index}`} />]
                : []),
              <NewTabButton data={item.url} key={`new-tab-${index}`} />,
            ]}
          />
        );
      }

      if (item.kind === panelKind.EMAIL) {
        return (
          <PanelItem
            key={`${item.email}-${index}`}
            header={
              item.title ? <PanelItemDescription>{itemTitle}</PanelItemDescription> : undefined
            }
            title={
              <LinkWrapper>
                <a href={'mailto:' + item.email}>{itemLabel}</a>
              </LinkWrapper>
            }
            actions={[
              ...(item.withCopyButton
                ? [<CopyButton data={item.copyContent || item.email} key={`copy-${index}`} />]
                : []),
              <EmailButton data={item.email} key={`email-${index}`} />,
            ]}
          />
        );
      }

      if (item.kind === panelKind.ATTRIBUTE) {
        return (
          <PanelItem
            key={`${item.label}-${index}`}
            header={
              item.title ? <PanelItemDescription>{itemTitle}</PanelItemDescription> : undefined
            }
            title={item.value}
          />
        );
      }

      return null;
    })
    .filter(Boolean);

  const hasItems = renderedItems.length > 0;

  if (!hasItems) {
    return null;
  }

  const panelHeader = resolveText(translate, node.titleTranslationKey, node.title);

  return (
    <OverviewPanel header={panelHeader} className="panel-api-docs" isExpandable={false}>
      <PanelItemsList>{renderedItems}</PanelItemsList>
    </OverviewPanel>
  );
}

const LinkWrapper = styled.div`
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: var(--link-color-primary);
    text-decoration: none;
    font-weight: var(--link-font-weight);

    &:hover {
      text-decoration: underline;
    }
  }
`;
