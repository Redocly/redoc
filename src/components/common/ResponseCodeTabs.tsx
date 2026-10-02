import { styled } from 'styled-components';

function responseCodeStatusDotColor(code: string): string {
  if (code.startsWith('2'))
    return 'var(--status-code-200-bg-color, var(--color-success-base, #00B200))';
  if (code.startsWith('3'))
    return 'var(--status-code-300-bg-color, var(--color-warning-base, #EB8700))';
  if (code.startsWith('4'))
    return 'var(--status-code-400-bg-color, var(--color-error-base, #E20C0C))';
  if (code.startsWith('5'))
    return 'var(--status-code-500-bg-color, var(--color-error-base, #E20C0C))';
  return 'var(--status-code-100-bg-color, var(--color-info-base, #6c757d))';
}

export const ResponseCodesTabList = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
`;

export const ResponseCodeTab = styled.button<{
  $active: boolean;
  $code: string;
}>`
  display: inline-flex;
  align-items: center;
  padding: 0 var(--spacing-sm);
  height: 24px;
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: ${({ $active }) => ($active ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)')};
  line-height: var(--line-height-base);
  color: ${({ $active }) =>
    $active ? 'var(--text-color-primary)' : 'var(--text-color-secondary)'};
  background-color: ${({ $active }) =>
    $active ? 'var(--tab-bg-color-filled, var(--border-color-secondary))' : 'transparent'};

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
    background-color: ${({ $code }) => responseCodeStatusDotColor($code)};
    border: 1px solid var(--bg-color, #fff);
  }

  &:hover {
    color: var(--text-color-primary);
  }
`;
