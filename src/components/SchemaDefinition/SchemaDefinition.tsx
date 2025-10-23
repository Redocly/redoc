import { memo, useCallback, useMemo } from 'react';
import { LayoutVariant } from '@redocly/config';
import { useAtom, useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { OpenAPIMediaType } from '../../types/index.js';
import type { OperationModel } from '../../models/index.js';

import { useWriteAtom } from '../../jotai/use-write-atom.js';
import { SamplesMiddlePanel, SamplesPanel, Row, Section, CodeBlockPanel } from '../common/index.js';
import { getMediaType } from '../../models/index.js';
import { MediaTypeSamples } from '../PayloadSamples/index.js';
import { Schema } from '../Schema/index.js';
import { Markdown } from '../Markdown/index.js';
import { layoutAtom } from '../../jotai/app.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { operationStore } from '../../jotai/operation.js';
import { styled } from '../../styled-components.js';

interface SchemaDefinitionProps {
  schemaRef?: string;
  exampleRef?: string;
  showReadOnly?: boolean;
  showWriteOnly?: boolean;
}

const getMediaTypeInfo = (schemaRef?: string, exampleRef?: string): OpenAPIMediaType => {
  if (!schemaRef) {
    return {};
  }

  const info: OpenAPIMediaType = {
    schema: { $ref: schemaRef },
  };

  if (exampleRef) {
    info.examples = { example: { $ref: exampleRef } };
  }

  return info;
};

function SchemaDefinitionComponent({
  schemaRef,
  exampleRef,
  showReadOnly = true,
  showWriteOnly = false,
}: SchemaDefinitionProps): ReactElement {
  const layout = useAtomValue(layoutAtom);
  const { parser, options } = useAtomValue(globalStoreAtom);
  const writeAtom = useWriteAtom();

  const mediaModel = useMemo(
    () =>
      getMediaType(parser, 'json', false, getMediaTypeInfo(schemaRef, exampleRef), options, {
        operation: { pointer: 'SchemaDefinitionComponent' } as OperationModel,
      }),
    [exampleRef, options, parser, schemaRef],
  );
  const [operationState, setOperation] = useAtom(operationStore(mediaModel.operation?.pointer));

  const handleMediaTypeChange = useCallback(
    (key: string): void => {
      if (!mediaModel.schema) return;
      const schema = mediaModel.schema;
      const schemaOneOf = schema.oneOf;
      if (schemaOneOf && mediaModel?.examples && Object.keys(mediaModel?.examples).includes(key)) {
        const activeOneOfIndex = schemaOneOf.findIndex((schema) => schema.title === key);
        if (activeOneOfIndex !== -1 && schema) {
          writeAtom(operationStore(schema.operationPointer), {
            activeExampleName: schema.oneOf?.[activeOneOfIndex]?.title,
            activeOneOf: { [schema.pointer]: activeOneOfIndex },
          });
        }
      }
      if (operationState.activeExampleName !== key) {
        setOperation({ activeExampleName: key });
      }
    },
    [
      mediaModel?.examples,
      mediaModel.schema,
      operationState.activeExampleName,
      setOperation,
      writeAtom,
    ],
  );

  const isStacked = layout === LayoutVariant.STACKED;

  return (
    <Section>
      <Row layout={layout}>
        <DefinitionMiddlePanel isStacked={isStacked}>
          {mediaModel.schema?.description && (
            <Description>
              <Markdown source={mediaModel.schema?.description} />
            </Description>
          )}
          <Schema
            skipWriteOnly={!showWriteOnly}
            skipReadOnly={!showReadOnly}
            schema={mediaModel.schema}
            level={1}
          />
        </DefinitionMiddlePanel>
        <SamplesPanel isStacked={isStacked}>
          <CodeBlockPanel className="panel-response-samples">
            <MediaTypeSamples mediaType={mediaModel} onChange={handleMediaTypeChange} />
          </CodeBlockPanel>
        </SamplesPanel>
      </Row>
    </Section>
  );
}

export const SchemaDefinition = memo<SchemaDefinitionProps>(SchemaDefinitionComponent);

const Description = styled.div`
  margin-bottom: var(--spacing-vertical);
`;

const DefinitionMiddlePanel = styled(SamplesMiddlePanel)`
  padding-left: 0;
`;
