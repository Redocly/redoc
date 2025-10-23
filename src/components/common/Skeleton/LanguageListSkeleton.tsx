import { memo, type ReactElement } from 'react';

import { styled } from '../../../styled-components.js';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
`;

const SkeletonBox = styled.div<{ type?: 'icon' | 'label'; height?: string }>`
  display: inline-block;
  height: ${({ type }) =>
    type === 'icon' ? 'var(--control-height-sm)' : 'calc(var(--control-height-sm) * 0.5)'};
  position: relative;
  overflow: hidden;
  background-color: var(--layer-color-hover);
  border-radius: var(--border-radius);
  width: ${({ type }) => (type === 'icon' ? 'var(--control-height-sm)' : '64px')};
`;

function LanguageListSkeletonComponent(): ReactElement {
  return (
    <Container>
      <Item>
        <SkeletonBox type="icon" />
        <SkeletonBox type="label" />
      </Item>
      <Item>
        <SkeletonBox type="icon" />
        <SkeletonBox type="label" />
      </Item>
      <Item>
        <SkeletonBox type="icon" />
        <SkeletonBox type="label" />
      </Item>
      <Item>
        <SkeletonBox type="icon" />
        <SkeletonBox type="label" />
      </Item>
    </Container>
  );
}

export const LanguageListSkeleton = memo(LanguageListSkeletonComponent);
