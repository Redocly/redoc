import { styled } from 'styled-components';

export const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

export const Header = styled.span`
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-lg);
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-xxs) / 2);
`;

export const Label = styled.span`
  color: var(--text-color-description);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

export const Value = styled.span`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

export const ExternalDocumentationWrapper = styled.div`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

export const HostList = styled.span`
  display: flex;
  flex-direction: column;
`;
