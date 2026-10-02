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
import { buildMcpExamplePanel, buildPromptArgumentsSchema, useMcpDescriptionAst } from './utils.js';

interface McpPromptProps {
  name: string;
  id?: string;
}

function McpPromptComponent({ name }: McpPromptProps): ReactElement | null {
  const store = useAtomValue(storeAtom);
  const translate = useSpecTranslate();

  const prompt = useMemo(() => {
    return store.mcp?.prompts?.find((p) => p.name === name);
  }, [store.mcp, name]);

  const descriptionAst = useMcpDescriptionAst(prompt?.description);

  const argumentsSchema = useMemo(() => {
    if (!prompt?.arguments?.length) return null;
    return buildPromptArgumentsSchema(prompt.arguments);
  }, [prompt]);

  const panels = useMemo(
    () => (argumentsSchema ? [buildMcpExamplePanel(argumentsSchema, 'arguments')] : undefined),
    [argumentsSchema],
  );

  const argsDeepLink = useDeepLinkUrl('arguments');
  const argsSectionData = useMemo<DeepLinkSectionValue>(() => ({ t: 'arguments' }), []);

  if (!prompt) {
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
      {argumentsSchema && (
        <ContentWrapper panels={panels}>
          <McpSubRow>
            <McpTitleWrapper id={getDeepLinkId(argsDeepLink)}>
              <McpTitle>
                {argsDeepLink && <DeepLinkAnchor to={argsDeepLink} label="link to Arguments" />}
                {translate('openapi.mcp.inputSchema', 'Arguments')}
              </McpTitle>
            </McpTitleWrapper>
            <DeepLinkSectionContext.Provider value={argsSectionData}>
              <SchemaView schema={argumentsSchema} expandByDefault />
            </DeepLinkSectionContext.Provider>
          </McpSubRow>
        </ContentWrapper>
      )}
    </McpSection>
  );
}

export const McpPrompt = memo(McpPromptComponent);
