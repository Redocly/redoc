import { memo } from 'react';

import type { ReactElement } from 'react';
import type { ContainerNode } from '../types/content.js';

import { ContentWrapper } from './common/ContentWrapper.js';
import { ComponentMapper } from './Mapper.js';

function ContainerItemComponent({
  node,
  itemPath,
  sectionId,
}: {
  node: ContainerNode;
  itemPath?: string;
  sectionId?: string;
}): ReactElement {
  const { children, panels } = node;

  return (
    <ContentWrapper panels={panels} sectionId={sectionId}>
      {children?.map((child, index) => (
        <ComponentMapper
          type={child.nodeType}
          node={child}
          key={`${node.nodeType}_${child.nodeType}_${index}`}
          parentNode={node}
          itemPath={itemPath}
        />
      ))}
    </ContentWrapper>
  );
}

export const ContainerItem = memo(ContainerItemComponent);
