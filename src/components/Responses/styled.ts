import { Title } from '../common/OperationItemTitle.js';
import { Markdown } from '../Markdown/index.js';
import { styled } from '../../styled-components.js';

export const HeadersCaption = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 18px;
  line-height: var(--line-height-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color-primary);
  padding: var(--spacing-xxs) 0;
`;

export const StyledHeadersProperties = styled.div`
  margin-top: var(--spacing-md);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  margin-top: var(--spacing-base);
`;

export const StyledTitle = styled(Title)`
  margin: 0 var(--spacing-sm) 0 0;
  position: relative;
`;

export const StyledDescription = styled(Markdown)`
  margin-top: var(--spacing-xs);
`;
