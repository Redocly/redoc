import { memo } from 'react';
import { LayoutVariant } from '@redocly/config';

import type { ReactElement } from 'react';
import type { GroupModel } from '../../models/index.js';

import { SamplesMiddlePanel, Row } from '../common/index.js';
import { Markdown } from '../Markdown/index.js';
import { ExternalDocumentation } from '../ExternalDocumentation/index.js';

export interface SectionItemProps {
  item: GroupModel;
  layout?: LayoutVariant;
}

function SectionItemComponent({ item, layout }: SectionItemProps): ReactElement | null {
  const { externalDocs, ast, description } = item;
  const isStacked = layout === LayoutVariant.STACKED;
  const isFullWidth = !item.parent || item.parent.type !== 'tag';

  return (
    <>
      <Markdown
        ast={ast}
        source={description}
        htmlWrap={(component: ReactElement) => (
          <SamplesMiddlePanel compact={true} fullWidth={isFullWidth} isStacked={isStacked}>
            {component}
          </SamplesMiddlePanel>
        )}
      />
      {externalDocs && (
        <Row>
          <SamplesMiddlePanel compact={true} fullWidth={isFullWidth} isStacked={isStacked}>
            <ExternalDocumentation externalDocs={externalDocs} />
          </SamplesMiddlePanel>
        </Row>
      )}
    </>
  );
}

export const SectionItem = memo<SectionItemProps>(SectionItemComponent);
