import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

import { styled } from '../../styled-components.js';

export const DescriptionEnumsBlock = styled(MarkdownWrapper)`
  table.md {
    margin: var(--spacing-xs) 0 0;
  }
`;

export const TypeWrapper = styled.div`
  line-height: 20px;
`;

export const ExampleSummary = styled.label`
  display: block;
  font-size: inherit;
  margin-bottom: 0.2em;
  font-weight: var(--font-weight-bold);
`;

export const ExampleWrap = styled.div`
  margin-top: 1em;
  font-size: var(--field-name-font-size);
`;

export const ExamplesList = styled.div`
  padding-left: 1.5em;
  margin-bottom: 1em;
`;

export const FieldDescriptionWrapper = styled.div`
  p {
    overflow-wrap: anywhere;
  }
`;
