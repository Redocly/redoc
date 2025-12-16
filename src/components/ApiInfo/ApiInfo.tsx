import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { ReactElement } from 'react';
import type { GroupModel } from '../../models/index.js';


import { SamplesMiddlePanel, Row } from '../common/index.js';
import { ExternalDocumentation } from '../ExternalDocumentation/index.js';
import { Markdown } from '../Markdown/index.js';
import { ApiHeader } from './styled.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { saveTextBeforeHeading } from '../../utils/saveTextBeforeHeading.js';
import { getValueFromMdParsedExtension } from '../../utils/helpers.js';

export function ApiInfo({
  item,
  layout,
}: {
  item: GroupModel;
  layout: LayoutVariant;
}): ReactElement | null {
  const {
    parser: { definition },
  } = useAtomValue(globalStoreAtom);
  const info = item.infoDefinition;

  if (!info) {
    return null;
  }
  const description = saveTextBeforeHeading(
    getValueFromMdParsedExtension(info, 'description') || '',
  );
  const summary = getValueFromMdParsedExtension(info, 'summary') || undefined;

  const externalDocs = definition?.externalDocs || info?.externalDocs;

  const isStacked = layout === LayoutVariant.STACKED;

  return (
    <Row layout={layout}>
      <SamplesMiddlePanel fullWidth className="api-info" isStacked={isStacked}>
        <ApiHeader>
          {(info.title || '') + (info.version ? ` (${info.version})` : '')}
        </ApiHeader>
        {summary && <Markdown source={summary} data-role="redoc-summary" />}
        {description && <Markdown source={description} data-role="redoc-description" />}
        {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
      </SamplesMiddlePanel>
    </Row>
  );
}
