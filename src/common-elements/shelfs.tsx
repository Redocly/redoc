import * as React from 'react';
import styled from '../styled-components';

const directionMap = {
  left: '90deg',
  right: '-90deg',
  up: '-180deg',
  down: '0',
};

const IntShelfIcon = (props: {
  className?: string;
  float?: 'left' | 'right';
  size?: string;
  color?: string;
  direction: 'left' | 'right' | 'up' | 'down';
  style?: React.CSSProperties;
}): JSX.Element => {
  return (
    <svg
      className={props.className}
      style={props.style}
      version="1.1"
      viewBox="0 0 24 24"
      x="0"
      xmlns="http://www.w3.org/2000/svg"
      y="0"
      aria-hidden="true"
    >
      <polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 " />
    </svg>
  );
};

export const ShelfIcon = styled(IntShelfIcon)`
  height: ${props => props.size || '18px'};
  width: ${props => props.size || '18px'};
  min-width: ${props => props.size || '18px'};
  vertical-align: middle;
  float: ${props => props.float || ''};
  transition: transform 0.2s ease-out;
  transform: rotateZ(${props => directionMap[props.direction || 'down']});

  polygon {
    fill: ${({ color, theme }) =>
      (color && theme.colors.responses[color] && theme.colors.responses[color].color) || color};
  }
`;

export const Badge = styled.span<{ type: string; color?: string }>`
  display: inline-block;
  padding: 2px 8px;
  margin: 0;
  background-color: ${props => props.color || props.theme.colors[props.type].main};
  color: ${props => props.theme.colors[props.type].contrastText};
  font-size: ${props => props.theme.typography.code.fontSize};
  vertical-align: middle;
  line-height: 1.6;
  border-radius: 4px;
  font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  font-size: 12px;
  + span[type] {
    margin-left: 4px;
  }
`;
