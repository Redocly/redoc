import { H1 } from '@redocly/theme/components/Typography/H1';
import { Markdown } from '@redocly/theme/components/Markdown/Markdown';

import { styled } from '../../styled-components.js';

const delimiterWidth = 15;

export const ApiHeader = styled(H1)`
  display: flex;
  margin-top: 0;
  margin-bottom: 0;
  & + ${Markdown} {
    margin-top: var(--h1-margin-bottom);
  }
`;

export const InfoSpan = styled.span`
  &::before {
    content: '|';
    display: inline-block;
    opacity: 0.5;
    width: ${delimiterWidth}px;
    text-align: center;
  }

  &:last-child::after {
    display: none;
  }
`;

export const InfoSpanBoxWrap = styled.div`
  overflow: hidden;
`;

export const InfoSpanBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  // hide separator on new lines: idea from https://stackoverflow.com/a/31732902/1749888
  margin-left: -${delimiterWidth}px;
`;
