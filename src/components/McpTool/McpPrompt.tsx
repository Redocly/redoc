import { memo, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { McpPrompt as McpPromptType } from '../../types/open-api.js';

import { getMediaContent, getSecurity, type OperationModel } from '../../models/index.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { Section, Row, SamplesMiddlePanel, SamplesPanel, CodeBlockPanel } from '../common/index.js';
import { Schema } from '../Schema/index.js';
import { layoutAtom } from '../../jotai/app.js';
import { MediaTypeSamples } from '../PayloadSamples/MediaTypeSamples.js';
import { useTranslate } from '../../hooks/index.js';
import { Title } from '../common/OperationItemTitle.js';
import { LinkToField } from '../common/LinkToField.js';
import { makeDeepLink } from '../../services/index.js';
import { Security } from '../Security/Security.js';
import { styled } from '../../styled-components.js';

interface McpPromptProps {
  name: string;
  id: string;
}

function McpPromptComponent({ name, id }: McpPromptProps) {
  const { parser } = useAtomValue(globalStoreAtom);
  const translate = useTranslate();

  const prompt = useMemo((): McpPromptType | undefined => {
    const prompts = parser.definition['x-mcp']?.prompts || [];
    return prompts.find((p: McpPromptType) => p.name === name);
  }, [parser, name]);

  const securityModel = useMemo(() => {
    if (!prompt) {
      return null;
    }
    return getSecurity(prompt.security, parser);
  }, [parser, prompt]);

  if (!prompt) {
    return null;
  }

  return (
    <Section>
      <Content
        id={id}
        type="input"
        prompt={prompt}
        title={translate('openapi.mcp.inputSchema', 'Arguments')}
        exampleTitle={translate('openapi.mcp.inputExample', 'Arguments example')}
      >
        {securityModel && <Security securities={securityModel} />}
      </Content>
    </Section>
  );
}

function Content({
  id,
  type,
  prompt,
  title,
  exampleTitle,
  children,
}: {
  id: string;
  type: 'input' | 'output';
  prompt: McpPromptType;
  title: string;
  exampleTitle: string;
  children?: React.ReactNode;
}) {
  const { parser, options } = useAtomValue(globalStoreAtom);
  const layout = useAtomValue(layoutAtom);
  const isStacked = layout === LayoutVariant.STACKED;

  const mediaContent = useMemo(() => {
    const parametersSchema = prompt.arguments && {
      type: 'object',
      properties: prompt.arguments.reduce((acc, argument) => {
        acc[argument.name] = {
          type: '',
          example: argument.example || 'string',
          description: argument.description,
          required: argument.required,
        };
        return acc;
      }, {}),
      required: prompt.arguments
        .filter((argument) => argument.required)
        .map((argument) => argument.name),
    };

    if (!parametersSchema) {
      return null;
    }

    return getMediaContent({
      parser,
      info: {
        'application/json': {
          schema: parametersSchema,
        },
      },
      isRequestType: false,
      options,
      data: {
        operation: { pointer: 'McpPrompt' } as OperationModel,
      },
    });
  }, [options, parser, prompt]);

  const nope = useCallback(() => {}, []);

  return (
    <McpSubRowStyled layout={layout}>
      <McpToolMiddlePanel isStacked={isStacked}>
        <div>
          {children}
          {mediaContent && (
            <>
              {' '}
              <Title>
                {id && <LinkToField to={makeDeepLink(id, type)} />}
                {title}
              </Title>
              <Schema schema={mediaContent.mediaTypes[0].schema} />
            </>
          )}
        </div>
      </McpToolMiddlePanel>
      {mediaContent && (
        <SamplesPanel isStacked={isStacked}>
          <CodeBlockPanel className="panel-response-samples" header={exampleTitle}>
            <MediaTypeSamples mediaType={mediaContent.mediaTypes[0]} onChange={nope} />
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

export const McpPrompt = memo<McpPromptProps>(McpPromptComponent);
