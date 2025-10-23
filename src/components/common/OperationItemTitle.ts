import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';
import { H2 } from '@redocly/theme/components/Typography/H2';

import { styled } from '../../styled-components.js';

export const Title = styled.h4`
  font-size: var(--h4-font-size);
  font-weight: var(--h4-font-weight);
  line-height: var(--h4-line-height);
  padding: 0;
  color: var(--h4-text-color);
  margin: 0 0 var(--h4-margin-bottom) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  :hover {
    ${LinkIcon} {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export const Heading = styled(H2)`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin: 0;

  :hover {
    ${LinkIcon} {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: var(--h2-margin-top) 0 var(--h2-margin-bottom);
`;
