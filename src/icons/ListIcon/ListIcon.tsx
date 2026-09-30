import { useId } from 'react';
import { styled } from 'styled-components';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: string;
};

export const Icon = (props: IconProps) => {
  const clipId = `list-icon-clip-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-component-name="icons/ListIcon/ListIcon"
      {...props}
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 11H22" strokeLinecap="round" />
        <circle cx="4" cy="11" r="4" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ListIcon = styled(Icon).withConfig({
  shouldForwardProp: (prop) => prop !== 'size',
})<IconProps>`
  path,
  circle {
    fill: currentColor;
    stroke: currentColor;
  }

  height: ${({ size }) => size || '16px'};
  width: ${({ size }) => size || '16px'};
`;
