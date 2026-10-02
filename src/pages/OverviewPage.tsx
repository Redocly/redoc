import { Fragment, memo } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ApiItemContent } from '../types/content.js';

import { ComponentMapper } from '../components/Mapper.js';
import { compose } from '../utils/compose.js';
import { withItemId } from '../hoc/withItemId.js';

function OverviewPageComponent({
  content,
  itemPath,
}: {
  content: ApiItemContent;
  itemPath: string;
  sectionId?: string;
}): ReactElement {
  const { children } = content || {};
  return (
    <OverviewWrapper>
      {children?.map((child, _index) => (
        <Fragment key={`${itemPath}-${child.nodeType}`}>
          <ComponentMapper
            type={child.nodeType}
            node={child}
            key={`${itemPath}-${child.nodeType}`}
          />
        </Fragment>
      ))}
    </OverviewWrapper>
  );
}

export const OverviewPage = compose(withItemId, memo)(OverviewPageComponent);

const OverviewWrapper = styled.div`
  padding: var(--spacing-xs) 0 var(--spacing-xxl) 0;
  border-bottom: 1px solid var(--border-color-secondary);

  [data-testid='middle-panel'] > :first-child {
    padding-top: calc(var(--spacing-unit) * 7);
  }
  [data-component-name='Markdown/Markdown'] :is(h1, h2, h3, h4, h5, h6) {
    padding-top: var(--spacing-xs);
  }
`;
