import { useCallback } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { DownloadNode } from '../../types/content.js';

import { DownloadButton } from '@redocly/theme/components/Buttons/DownloadButton';
import { JsonIcon } from '@redocly/theme/icons/JsonIcon/JsonIcon';
import { FileIcon } from '@redocly/theme/icons/FileIcon/FileIcon';
import { GraphqlIcon } from '@redocly/theme/icons/GraphqlIcon/GraphqlIcon';
import { DocumentIcon } from '@redocly/theme/icons/DocumentIcon/DocumentIcon';

import { panelKind } from '../../types/common.js';
import { getFileExtension } from '../../utils/string.js';
import { PanelItem, PanelItemsList } from '../common/PanelItem.js';
import { OverviewPanel } from './styled.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { downloadDefinitionItem, useTelemetry } from '../../telemetry/index.js';
import { resolveText } from '../../utils/resolveText.js';

export function DownloadPanelItem({ node }: { node: DownloadNode }): ReactElement {
  const translate = useSpecTranslate();
  const telemetry = useTelemetry();
  const downloadItems = node.children.filter((item) => item.kind === panelKind.DOWNLOAD);

  const fileIcons = {
    yaml: <DocumentIcon />,
    json: <JsonIcon />,
    file: <FileIcon />,
    graphql: <GraphqlIcon />,
    gql: <GraphqlIcon />,
  };

  const panelHeader = resolveText(translate, node.titleTranslationKey, node.title);

  const handleDownloadClick = useCallback(
    (label: string | undefined, url: string) => {
      telemetry.sendDownloadDefinitionClickedMessage([downloadDefinitionItem(label, url)]);
    },
    [telemetry],
  );

  return (
    <OverviewPanel header={panelHeader} className="panel-api-docs" isExpandable={false}>
      <PanelItemsListStyled>
        {downloadItems.map(({ label, url }) => {
          const extension = getFileExtension(label || url);
          const icon = fileIcons[extension as keyof typeof fileIcons] || <FileIcon />;
          const onClick = (): void => handleDownloadClick(label, url);

          return (
            <PanelItem
              key={`${label}-${url}`}
              title={
                <LinkWrapper>
                  {icon}
                  <Link href={url} target="_blank" download rel="noreferrer" onClick={onClick}>
                    {label}
                  </Link>
                </LinkWrapper>
              }
              actions={[
                <DownloadAction key={`${label}-download`} onClick={onClick}>
                  <DownloadButton data={url} />
                </DownloadAction>,
              ]}
            />
          );
        })}
      </PanelItemsListStyled>
    </OverviewPanel>
  );
}

const LinkWrapper = styled.div`
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const Link = styled.a`
  color: var(--text-color-secondary);
  text-decoration: none;
  font-weight: var(--link-font-weight);
`;

const DownloadAction = styled.div`
  display: flex;
`;

const PanelItemsListStyled = styled(PanelItemsList)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);

  & > span {
    padding-bottom: var(--spacing-sm);
    margin-bottom: 0;
  }
`;
