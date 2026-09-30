import { styled } from 'styled-components';

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 32 32"
    >
      <path d="M23,20l-1.4141,1.4141L24.1719,24H6V4H4V24a2.0023,2.0023,0,0,0,2,2H24.1719l-2.586,2.5859L23,30l5-5Z" />
    </svg>
  );
}

export const ArrowIcon = styled(Arrow)`
  flex: none;
  fill: var(--icon-color-primary, currentColor);
`;
