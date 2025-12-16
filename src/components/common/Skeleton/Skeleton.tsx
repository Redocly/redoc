import { keyframes } from 'styled-components';

import type { ReactElement } from 'react';

import { H2 } from '@redocly/theme/components/Typography/H2';

import { Section, SamplesMiddlePanel } from '../panels.js';
import { styled } from '../../../styled-components.js';

const shimmer = keyframes`
  100% {
      transform: translateX(100%);
  }
`;

export const SkeletonBox = styled.div<{ width?: string }>`
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-color-raised);
  border-radius: var(--border-radius);
  margin-top: var(--spacing-base);
  width: ${({ width }) => width || '100%'};

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: ${shimmer} 2s infinite;
    content: '';
  }
`;

export function Skeleton(): ReactElement {
  return (
    <Section>
      <SamplesMiddlePanel>
        <H2>
          <SkeletonBox width="40%" />
        </H2>
        <SkeletonBox width="80%" />
        <SkeletonBox width="90%" />
        <SkeletonBox width="83%" />
        <SkeletonBox width="80%" />
      </SamplesMiddlePanel>
    </Section>
  );
}
