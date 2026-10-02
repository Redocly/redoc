import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { DeepLinkSectionValue } from '../../hooks/useDeepLinkSection.js';

import { storeAtom } from '../../jotai/store.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { SchemaView } from '../Schema/SchemaView.js';
import { ContentWrapper } from '../common/ContentWrapper.js';
import { DeepLinkAnchor } from '../common/DeepLinkAnchor.js';
import { Markdown } from '../common/Markdown.js';
import { getDeepLinkId } from '../../utils/deep-link.js';
import { DeepLinkSectionContext, useDeepLinkUrl } from '../../hooks/useDeepLinkSection.js';
import { McpSection, McpSubRow, McpTitle, McpTitleWrapper } from './styled.js';
import { buildMcpExamplePanel, useMcpDescriptionAst } from './utils.js';

interface McpToolProps {
  name: string;
  id?: string;
}

function McpToolComponent({ name }: McpToolProps): ReactElement | null {
  const store = useAtomValue(storeAtom);
  const translate = useSpecTranslate();

  const tool = useMemo(() => {
    return store.mcp?.tools?.find((t) => t.name === name);
  }, [store.mcp, name]);

  const descriptionAst = useMcpDescriptionAst(tool?.description);

  const inputPanels = useMemo(
    () => (tool?.inputSchema ? [buildMcpExamplePanel(tool.inputSchema, 'input')] : undefined),
    [tool?.inputSchema],
  );

  const outputPanels = useMemo(
    () => (tool?.outputSchema ? [buildMcpExamplePanel(tool.outputSchema, 'output')] : undefined),
    [tool?.outputSchema],
  );

  const inputDeepLink = useDeepLinkUrl('input-schema');
  const inputSectionData = useMemo<DeepLinkSectionValue>(() => ({ t: 'input-schema' }), []);

  const outputDeepLink = useDeepLinkUrl('output-schema');
  const outputSectionData = useMemo<DeepLinkSectionValue>(() => ({ t: 'output-schema' }), []);

  if (!tool) {
    return null;
  }

  return (
    <McpSection>
      <ContentWrapper>
        <McpSubRow>
          <p>
            {translate('openapi.mcp.toolName', 'Tool name')}: <code>{tool.name}</code>
          </p>
          {descriptionAst ? <Markdown source={descriptionAst} /> : null}
        </McpSubRow>
      </ContentWrapper>

      {tool.inputSchema && (
        <ContentWrapper panels={inputPanels}>
          <McpSubRow>
            <McpTitleWrapper id={getDeepLinkId(inputDeepLink)}>
              <McpTitle>
                {inputDeepLink && (
                  <DeepLinkAnchor to={inputDeepLink} label="link to Input schema" />
                )}
                {translate('openapi.mcp.inputSchema', 'Input schema')}
              </McpTitle>
            </McpTitleWrapper>
            <DeepLinkSectionContext.Provider value={inputSectionData}>
              <SchemaView schema={tool.inputSchema} expandByDefault />
            </DeepLinkSectionContext.Provider>
          </McpSubRow>
        </ContentWrapper>
      )}

      {tool.outputSchema && (
        <ContentWrapper panels={outputPanels}>
          <McpSubRow>
            <McpTitleWrapper id={getDeepLinkId(outputDeepLink)}>
              <McpTitle>
                {outputDeepLink && (
                  <DeepLinkAnchor to={outputDeepLink} label="link to Output schema" />
                )}
                {translate('openapi.mcp.outputSchema', 'Output schema')}
              </McpTitle>
            </McpTitleWrapper>
            <DeepLinkSectionContext.Provider value={outputSectionData}>
              <SchemaView schema={tool.outputSchema} expandByDefault />
            </DeepLinkSectionContext.Provider>
          </McpSubRow>
        </ContentWrapper>
      )}
    </McpSection>
  );
}

export const McpTool = memo(McpToolComponent);
