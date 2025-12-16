type IconProps = React.SVGProps<SVGSVGElement>;

import { styled } from '../../styled-components.js';

export const Icon = (props: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10.5 9.75H9.375V9H10.5V3H9.375V2.25H10.5C10.6988 2.25023 10.8895 2.32932 11.0301 2.46992C11.1707 2.61052 11.2498 2.80116 11.25 3V9C11.2497 9.19883 11.1706 9.38944 11.03 9.53003C10.8894 9.67063 10.6988 9.74973 10.5 9.75Z" />
    <path d="M8.625 6.75C9.03921 6.75 9.375 6.41421 9.375 6C9.375 5.58579 9.03921 5.25 8.625 5.25C8.21079 5.25 7.875 5.58579 7.875 6C7.875 6.41421 8.21079 6.75 8.625 6.75Z" />
    <path d="M6 6.75C6.41421 6.75 6.75 6.41421 6.75 6C6.75 5.58579 6.41421 5.25 6 5.25C5.58579 5.25 5.25 5.58579 5.25 6C5.25 6.41421 5.58579 6.75 6 6.75Z" />
    <path d="M3.375 6.75C3.78921 6.75 4.125 6.41421 4.125 6C4.125 5.58579 3.78921 5.25 3.375 5.25C2.96079 5.25 2.625 5.58579 2.625 6C2.625 6.41421 2.96079 6.75 3.375 6.75Z" />
    <path d="M2.625 9.75H1.5C1.30116 9.74977 1.11052 9.67068 0.969922 9.53008C0.829319 9.38948 0.750228 9.19884 0.75 9V3C0.750199 2.80115 0.82928 2.6105 0.969889 2.46989C1.1105 2.32928 1.30115 2.2502 1.5 2.25H2.625V3H1.5V9H2.625V9.75Z" />
  </svg>
);

export const DefaultMappingIcon = styled(Icon).attrs<IconProps>(
  () =>
    ({
      'data-component-name': 'icons/DefaultMappingIcon',
    }) as IconProps,
)<IconProps>`
  path {
    fill: var(--color-warm-grey-11);
    html.dark & {
      fill: var(--text-color-secondary);
    }
  }
`;
