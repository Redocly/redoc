import { useMemo } from 'react';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { ItemContentNode, ParameterData } from '../../../types/content.js';
import type { DeepLinkSectionValue } from '../../../hooks/useDeepLinkSection.js';

import { SchemaView } from '../../Schema/SchemaView.js';
import { schemaEntryAtom } from '../../../jotai/schema.js';
import { DeepLinkSectionContext, useCallbackScope } from '../../../hooks/useDeepLinkSection.js';
import { serializeParameterValue } from '../../../utils/serialize-parameter.js';
import { tryDecodeURIComponent } from '../../../utils/string.js';

export function ParametersSection({ node }: { node: ItemContentNode }): ReactElement {
  const params = node.parameters;
  const paramLocation = node.variant as string;
  const callbackScope = useCallbackScope();

  const sectionData = useMemo<DeepLinkSectionValue>(
    () => ({ t: 'request', in: paramLocation, cb: callbackScope }),
    [paramLocation, callbackScope],
  );

  if (!params || params.length === 0) {
    return <></>;
  }

  return (
    <DeepLinkSectionContext.Provider value={sectionData}>
      <ParameterList>
        {params.map((param, index) => (
          <ParameterRow key={`${param.name}-${index}`} param={param} />
        ))}
      </ParameterList>
    </DeepLinkSectionContext.Provider>
  );
}

export function getParameterExampleSerializer(
  param: ParameterData,
): ((value: unknown) => string) | undefined {
  if (!param.in) return undefined;
  return (value) => tryDecodeURIComponent(serializeParameterValue(param, value));
}

function ParameterRow({ param }: { param: ParameterData }): ReactElement {
  const schemaEntry = useAtomValue(schemaEntryAtom(param.schemaId));
  const paramSchema = schemaEntry?.data;

  const paramHead = {
    ...(param.deprecated !== undefined ? { deprecated: param.deprecated } : {}),
    ...(param.description != null ? { description: param.description } : {}),
  };
  const paramExamples = {
    ...(param.example != null ? { example: param.example } : {}),
    ...(param.examples ? { examples: param.examples } : {}),
  };

  const propertyDef: Record<string, unknown> = {
    allOf: [paramHead, paramSchema, paramExamples],
    ...(param.badges?.length ? { 'x-badges': param.badges } : {}),
    ...param.extensions,
  };

  const schema = {
    type: 'object',
    required: param.required ? [param.name] : [],
    properties: {
      [param.name]: propertyDef,
    },
  } as Record<string, unknown>;

  return (
    <SchemaView
      schema={schema}
      level={1}
      exampleSerializer={getParameterExampleSerializer(param)}
    />
  );
}

const ParameterList = styled.div`
  display: flex;
  flex-direction: column;
`;
