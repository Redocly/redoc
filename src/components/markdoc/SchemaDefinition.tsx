import { memo, useMemo, type ReactElement } from 'react';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';

import type { PanelNode, ExamplesNode } from '../../types/content.js';
import type { SchemaNode } from '../../types/schema.js';

import { panelKind } from '../../types/common.js';
import { refPointerToStoreId } from '../../utils/refPointer.js';
import { DeepLinkSectionContext } from '../../hooks/useDeepLinkSection.js';
import { schemaEntryAtom } from '../../jotai/schema.js';
import { useResolvedExamples } from '../ItemContent/hooks.js';
import { SchemaView } from '../Schema/SchemaView.js';
import { Markdown } from '../common/Markdown.js';
import { ContentWrapper } from '../common/ContentWrapper.js';
import {
  detectJsonSchemaType,
  isPrimitiveLikeSchema,
} from '../../services/schema/propertyBuilder.js';

function isStructuralSchema(data: SchemaNode): boolean {
  const type = data.type || detectJsonSchemaType(data);
  return !isPrimitiveLikeSchema(data, type);
}

export type SchemaDefinitionProps = {
  schemaRef?: string;
  exampleRef?: string;
  showReadOnly?: boolean;
  showWriteOnly?: boolean;
  htmlWrap?: string | boolean;
};

function SchemaDefinitionComponent({
  schemaRef,
  exampleRef,
  showReadOnly = true,
  showWriteOnly = false,
}: SchemaDefinitionProps): ReactElement {
  const schemaId = refPointerToStoreId(schemaRef);
  const exampleId = refPointerToStoreId(exampleRef);
  const schemaEntry = useAtomValue(schemaEntryAtom(schemaId ?? ''));

  const exampleIds = useMemo(() => (exampleId ? [exampleId] : undefined), [exampleId]);

  const resolved = useResolvedExamples(schemaId, exampleIds, 'response', 'application/json');

  const sectionData = useMemo(() => ({ pathOnly: true as const }), []);

  const descriptionSource = useMemo((): unknown => {
    const data = schemaEntry?.data;
    const raw = data?.description;
    if (!raw || (typeof raw === 'string' && !raw.trim()) || !data || !isStructuralSchema(data)) {
      return undefined;
    }
    // Schema descriptions aren't parsed at build — `raw` is a raw markdown string (standalone,
    // parsed lazily by the adapter) or an AST/renderable tree (an embedder that pre-parses).
    return raw;
  }, [schemaEntry?.data]);

  const hasSamples = resolved.length > 0;

  const panels = useMemo((): PanelNode[] | undefined => {
    if (!schemaId || !schemaEntry || !hasSamples) return undefined;
    const examplesPanel: ExamplesNode = {
      children: [
        {
          kind: panelKind.RESPONSE,
          schemaId,
          exampleIds,
          hideHeaderTitle: true,
          examples: [],
        },
      ],
    };
    return [examplesPanel];
  }, [schemaId, schemaEntry, hasSamples, exampleIds]);

  if (!schemaId || !schemaEntry) {
    return <></>;
  }

  return (
    <div data-testid="schema-definition">
      <ContentWrapper panels={panels}>
        {descriptionSource ? (
          <Description>
            <Markdown source={descriptionSource} />
          </Description>
        ) : null}
        <DeepLinkSectionContext.Provider value={sectionData}>
          <SchemaView
            expandByDefault
            level={1}
            schemaId={schemaId}
            skipReadOnly={!showReadOnly}
            skipWriteOnly={!showWriteOnly}
          />
        </DeepLinkSectionContext.Provider>
      </ContentWrapper>
    </div>
  );
}

export const SchemaDefinition = memo(SchemaDefinitionComponent);

const Description = styled.div`
  margin-bottom: var(--spacing-vertical);
  p:last-child {
    margin-bottom: 0;
  }
`;
