import { memo, useMemo } from 'react';
import * as React from 'react';
import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import { CodeBlock } from '@redocly/theme/components/CodeBlock/CodeBlock';
import { Tag } from '@redocly/theme/components/Tag/Tag';

import { getSecurity } from '../../models/index.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { Section, Row, SamplesMiddlePanel, SamplesPanel, CodeBlockPanel } from '../common/index.js';
import { layoutAtom } from '../../jotai/app.js';
import { useTranslate } from '../../hooks/index.js';
import { Security } from '../Security/Security.js';
import { styled } from '../../styled-components.js';

interface McpResourceProps {
  name: string;
  id: string;
}

function McpResourceComponent({ name }: McpResourceProps) {
  const { parser } = useAtomValue(globalStoreAtom);
  const translate = useTranslate();

  const resource = useMemo(() => {
    const resources = parser.definition['x-mcp']?.resources || [];
    return resources.find((r) => r.name === name);
  }, [parser, name]);

  const securityModel = useMemo(() => {
    if (!resource) {
      return null;
    }
    return getSecurity(resource.security, parser);
  }, [parser, resource]);

  if (!resource) {
    return <div>Resource not found: {name}</div>;
  }

  return (
    <Section>
      <LeftPanel
        uriTitle={translate('openapi.mcp.uriTitle', 'Resource URI')}
        mimeTypeTitle={translate('openapi.mcp.mimeTypeTitle', 'Resource MIME type')}
        exampleTitle={translate('openapi.mcp.exampleTitle', 'Resource content')}
        uri={resource.uri}
        mimeType={resource.mimeType}
        content={resource.blob ?? resource.text ?? ''}
      >
        {securityModel && <Security securities={securityModel} />}
      </LeftPanel>
    </Section>
  );
}

function LeftPanel({
  uriTitle,
  mimeTypeTitle,
  exampleTitle,
  uri,
  mimeType,
  content,
  children,
}: {
  uriTitle: string;
  mimeTypeTitle: string;
  exampleTitle: string;
  children?: React.ReactNode;
  uri: string;
  mimeType: string;
  content: string;
}) {
  const layout = useAtomValue(layoutAtom);
  const isStacked = layout === LayoutVariant.STACKED;
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <McpSubRowStyled layout={layout}>
      <McpToolMiddlePanel isStacked={isStacked}>
        <div>
          {children}
          <RowLine>
            {uriTitle}:{'  '}
            <StyledTag onClick={(e) => copyToClipboard(uri, 'uri', e)} title="Click to copy">
              {copiedField === 'uri' ? '✓ Copied!' : uri}
            </StyledTag>
          </RowLine>
          <RowLine>
            {mimeTypeTitle}:{' '}
            <StyledTag
              onClick={(e) => copyToClipboard(mimeType, 'mimeType', e)}
              title="Click to copy"
            >
              {copiedField === 'mimeType' ? '✓ Copied!' : mimeType}
            </StyledTag>
          </RowLine>
        </div>
      </McpToolMiddlePanel>
      {content && (
        <SamplesPanel isStacked={isStacked}>
          <CodeBlockPanel className="panel-response-samples" header={exampleTitle}>
            <StyledCodeBlock
              source={content}
              header={{ title: mimeType, controls: { copy: {} } }}
            />
          </CodeBlockPanel>
        </SamplesPanel>
      )}
    </McpSubRowStyled>
  );
}

const McpSubRowStyled = styled(Row)`
  margin: calc(var(--spacing-unit) * 2) 0;

  & + & {
    margin-top: calc(var(--spacing-base) * 2);
  }
`;

const McpToolMiddlePanel = styled(SamplesMiddlePanel)`
  padding-left: 0;
`;

export const McpResource = memo<McpResourceProps>(McpResourceComponent);

const StyledTag = styled(Tag)`
  text-transform: none;
`;

const StyledCodeBlock = styled(CodeBlock)`
  border: none;
  padding: 0 8px;
`;

const RowLine = styled.div`
  margin: 1em 0;
`;
