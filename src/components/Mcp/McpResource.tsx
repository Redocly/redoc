import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Tag } from '@redocly/theme/components/Tag/Tag';

import { storeAtom } from '../../jotai/store.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { ContentWrapper } from '../common/ContentWrapper.js';
import { Markdown } from '../common/Markdown.js';
import { McpSection, McpSubRow, McpRowLine } from './styled.js';
import { buildResourceContentPanel, useMcpDescriptionAst } from './utils.js';

const StyledTag = styled(Tag)`
  text-transform: none;
`;

interface McpResourceProps {
  name: string;
  id?: string;
}

function McpResourceComponent({ name }: McpResourceProps): ReactElement | null {
  const store = useAtomValue(storeAtom);
  const translate = useSpecTranslate();

  const resource = useMemo(() => {
    return store.mcp?.resources?.find((r) => r.name === name);
  }, [store.mcp, name]);

  const descriptionAst = useMcpDescriptionAst(resource?.description);

  const contentPanels = useMemo(() => {
    if (!resource) return undefined;

    const panel = buildResourceContentPanel(resource);

    return panel ? [panel] : undefined;
  }, [resource]);

  if (!resource) {
    return null;
  }

  return (
    <McpSection>
      {descriptionAst ? (
        <ContentWrapper>
          <McpSubRow>
            <Markdown source={descriptionAst} />
          </McpSubRow>
        </ContentWrapper>
      ) : null}
      <ContentWrapper panels={contentPanels}>
        <McpSubRow>
          <McpRowLine>
            {translate('openapi.mcp.uriTitle', 'Resource URI')}:{' '}
            <StyledTag>{resource.uri}</StyledTag>
          </McpRowLine>
          <McpRowLine>
            {translate('openapi.mcp.mimeTypeTitle', 'Resource MIME type')}:{' '}
            <StyledTag>{resource.mimeType}</StyledTag>
          </McpRowLine>
        </McpSubRow>
      </ContentWrapper>
    </McpSection>
  );
}

export const McpResource = memo(McpResourceComponent);
