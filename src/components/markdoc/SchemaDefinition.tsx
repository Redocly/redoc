import { memo, useMemo, type ReactElement } from 'react';
import { useAtomValue } from 'jotai';

import type { PanelNode, ExamplesNode } from '../../types/content.js';

import { panelKind } from '../../types/common.js';
import { refPointerToStoreId } from '../../utils/refPointer.js';
import { DeepLinkSectionContext } from '../../hooks/useDeepLinkSection.js';
import { schemaEntryAtom } from '../../jotai/schema.js';
import { useResolvedExamples } from '../ItemContent/hooks.js';
import { SchemaView } from '../Schema/SchemaView.js';
import { ContentWrapper } from '../common/ContentWrapper.js';

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

  const sectionData = useMemo(
    () => ({ pathOnly: true as const, t: 'response', schemaId }),
    [schemaId],
  );

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
