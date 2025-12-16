import { memo, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { OpenAPISchema, Referenced } from '../../types/open-api.js';

import { getMediaContent, getSecurity, type OperationModel } from '../../models/index.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { Section, Row, SamplesMiddlePanel, SamplesPanel, CodeBlockPanel } from '../common/index.js';
import { Schema } from '../Schema/index.js';
import { getSchema } from '../../models/schema.js';
import { layoutAtom } from '../../jotai/app.js';
import { MediaTypeSamples } from '../PayloadSamples/MediaTypeSamples.js';
import { useTranslate } from '../../hooks/index.js';
import { Title } from '../common/OperationItemTitle.js';
import { LinkToField } from '../common/LinkToField.js';
import { makeDeepLink } from '../../services/index.js';
import { Security } from '../Security/Security.js';
import { styled } from '../../styled-components.js';

interface McpToolProps {
  name: string;
  id: string;
}

function McpToolComponent({ name, id }: McpToolProps) {
  const { parser } = useAtomValue(globalStoreAtom);
  const translate = useTranslate();

  const tool = useMemo(() => {
    const tools = parser.definition['x-mcp']?.tools || [];
    return tools.find((t: any) => t.name === name);
  }, [parser, name]);

  const securityModel = useMemo(() => {
    if (!tool) {
      return null;
    }
    return getSecurity(tool.security, parser);
  }, [parser, tool]);

  if (!tool) {
    return <div>Tool not found: {name}</div>;
  }

  return (
    <Section>
      <SchemaWithExamples
        id={id}
        type="input"
        schema={tool.inputSchema}
        title={translate('openapi.mcp.inputSchema', 'Input schema')}
        exampleTitle={translate('openapi.mcp.inputExample', 'Input example')}
      >
        {securityModel && <Security securities={securityModel} />}
      </SchemaWithExamples>

      {tool.outputSchema && (
        <SchemaWithExamples
          id={id}
          type="output"
          schema={tool.outputSchema}
          title={translate('openapi.mcp.outputSchema', 'Output schema')}
          exampleTitle={translate('openapi.mcp.outputExample', 'Output example')}
        />
      )}
    </Section>
  );
}

function SchemaWithExamples({
  schema,
  title,
  exampleTitle,
  id,
  type,
  children,
}: {
  schema: OpenAPISchema | Referenced<OpenAPISchema>;
  title: string;
  exampleTitle: string;
  id: string;
  type: 'input' | 'output';
  children?: React.ReactNode;
}) {
  const { parser, options } = useAtomValue(globalStoreAtom);
  const layout = useAtomValue(layoutAtom);
  const isStacked = layout === LayoutVariant.STACKED;
  const mediaContent = useMemo(() => {
    return getMediaContent({
      parser,
      info: {
        'application/json': {
          schema,
        },
      },
      isRequestType: false,
      options,
      data: {
        operation: { pointer: 'McpTool' } as OperationModel,
      },
    });
  }, [options, parser, schema]);
  const schemaModel = useMemo(() => {
    return (
      schema &&
      getSchema({
        parser,
        schemaOrRef: schema,
        pointer: '#',
        options,
        deps: {
          operation: { pointer: id } as OperationModel,
          parentFieldFullPath: type + '-schema',
        },
      })
    );
  }, [options, parser, schema, id, type]);
  const nope = useCallback(() => {}, []);

  return (
    <McpSubRowStyled layout={layout}>
      <McpToolMiddlePanel isStacked={isStacked}>
        <div>
          <Title>
            {id && <LinkToField to={makeDeepLink(id, type)} />}
            {title}
          </Title>
          {children}
          <Schema schema={schemaModel} />
        </div>
      </McpToolMiddlePanel>
      <SamplesPanel isStacked={isStacked}>
        <CodeBlockPanel className="panel-response-samples" header={exampleTitle}>
          <MediaTypeSamples mediaType={mediaContent.mediaTypes[0]} onChange={nope} />
        </CodeBlockPanel>
      </SamplesPanel>
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

export const McpTool = memo<McpToolProps>(McpToolComponent);
