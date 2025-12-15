import { memo } from 'react';
import { useAtom } from 'jotai';

import type { ReactElement } from 'react';
import type { OneOfChangeParams, SchemaProps } from './types.js';
import type { SchemaModel } from '../../models/index.js';

import { StyledBadge, SelectionTitle } from '../common/index.js';
import { Markdown } from '../Markdown/index.js';
import { ConstraintsView } from '../common/ConstraintsView.js';
import { Schema } from './Schema.js';
import { operationStore } from '../../jotai/operation.js';
import { SchemaSelection } from '../common/SchemaSelection/index.js';
import { useOneOfLocationIdx } from './useOneOfLocationIdx.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

interface OneOfSchemaProps extends SchemaProps {
  schema: SchemaModel & { oneOf: SchemaModel[] };
  oneOfLevel?: number;
  onChange?: (params: OneOfChangeParams) => void;
}

function OneOfSchemaComponent({
  schema: { oneOf },
  schema,
  onChange,
  oneOfLevel = 1,
  ...rest
}: OneOfSchemaProps): ReactElement | null {
  const translate = useTranslate();
  const [store, setOperationStore] = useAtom(operationStore(schema.operationPointer));
  const oneOfIdxLocation = useOneOfLocationIdx(oneOf, oneOfLevel);

  const options = oneOf.map((subSchema, idx) => ({
    label: subSchema.title || subSchema.typePrefix + subSchema.displayType,
    value: idx,
  }));
  const activeExampleNameIndex = options.findIndex(
    (option) => option.label === store.activeExampleName,
  );

  const activeOneOfIdx =
    oneOfIdxLocation === -1
      ? activeExampleNameIndex !== -1
        ? activeExampleNameIndex
        : 0
      : oneOfIdxLocation;

  const activeSchemaIndex =
    store.activeOneOf?.[schema.pointer] !== undefined
      ? store.activeOneOf[schema.pointer]
      : activeOneOfIdx;
  const activeSchema = oneOf[activeSchemaIndex];

  if (!activeSchema) {
    return null;
  }

  const handleChange = (value: number) => {
    onChange?.({
      pointer: schema.pointer,
      index: value,
    });

    setOperationStore({
      activeExampleName: schema.oneOf?.[value]?.title,
      activeOneOf: { [schema.pointer]: value },
      requestValues: { body: null },
    });
  };

  return (
    <Wrapper>
      <SelectionTitle>{schema.oneOfType}:</SelectionTitle>
      <SchemaSelection
        options={options}
        onChange={handleChange}
        pointer={schema.operationPointer}
        schema={schema}
        defaultOneOfIdx={activeOneOfIdx}
      />
      {activeSchema.deprecated && (
        <StyledBadge deprecated>{translate('openapi.badges.deprecated', 'Deprecated')}</StyledBadge>
      )}
      {activeSchema.description && <StyledDescription source={activeSchema.description} />}
      <ConstraintsView constraints={activeSchema.constraints} />
      <Schema {...rest} schema={activeSchema} oneOfLevel={oneOfLevel + 1} />
    </Wrapper>
  );
}

export const OneOfSchema = memo<OneOfSchemaProps>(OneOfSchemaComponent);

const StyledDescription = styled(Markdown)`
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;
