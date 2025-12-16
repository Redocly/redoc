import { memo, useCallback } from 'react';

import type { ReactElement } from 'react';
import type { DownloadIconType, UseDownloadInfoReturnType } from './types';

import { DownloadIcon } from '@redocly/theme/icons/DownloadIcon/DownloadIcon';
import { getPathPrefix, combineUrls } from '@redocly/theme/core/openapi';
import { Button } from '@redocly/theme/components/Button/Button';
import { DocumentIcon } from '@redocly/theme/icons/DocumentIcon/DocumentIcon';
import { JsonIcon } from '@redocly/theme/icons/JsonIcon/JsonIcon';
import { FileIcon } from '@redocly/theme/icons/FileIcon/FileIcon';

import { useTelemetry } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

function DownloadSpecificationComponent({
  downloadObjects,
}: {
  downloadObjects: UseDownloadInfoReturnType;
}): ReactElement {
  const telemetry = useTelemetry();
  const pathPrefix = getPathPrefix();

  const renderIcon = useCallback((iconType: DownloadIconType) => {
    switch (iconType) {
      case 'yaml':
        return <DocumentIcon />;
      case 'json':
        return <JsonIcon />;
      default:
        return <FileIcon />;
    }
  }, []);

  if (!downloadObjects) {
    return <></>;
  }

  return (
    <Wrapper>
      {(downloadObjects || []).map(({ title, url, iconType }) => {
        const downloadUrl = pathPrefix ? combineUrls(pathPrefix, url) : url;
        return (
          <Card
            key={title}
            onClick={() => {
              telemetry.sendDownloadDefinitionClickedMessage();
            }}
          >
            <FileName>
              {renderIcon(iconType)}
              <a href={downloadUrl} target="_blank" download rel="noreferrer">
                {title}
              </a>
            </FileName>
            <a href={downloadUrl} target="_blank" download rel="noreferrer">
              <Button variant="text" size="small" icon={<DownloadIcon />} />
            </a>
          </Card>
        );
      })}
    </Wrapper>
  );
}

export const DownloadSpecification = memo(DownloadSpecificationComponent);

const Card = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;

  border-bottom: 1px solid var(--border-color-secondary);
  padding-bottom: var(--spacing-sm);
  :last-of-type {
    padding-bottom: 0px;
    border-bottom: none;
  }
`;

const FileName = styled.span`
  display: flex;
  width: calc(100% - 25px);
  gap: var(--spacing-xs);
  align-items: center;

  svg {
    flex-shrink: 0;
  }
  a {
    width: 100%;
    color: var(--text-color-primary);
    word-break: break-word;
    text-decoration: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  justify-content: space-between;
  flex-direction: column;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
`;
