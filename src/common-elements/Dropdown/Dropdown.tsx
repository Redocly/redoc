import * as React from 'react';
import styled from '../../styled-components';
import { ArrowIconProps, DropdownProps, DropdownOption } from './types';

const ArrowSvg = ({ className, style }: ArrowIconProps): JSX.Element => (
  <svg
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ArrowIcon = styled(ArrowSvg)`
  position: absolute;
  pointer-events: none;
  z-index: 1;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 8px;
  margin: auto;
  text-align: center;
  polyline {
    color: ${props => props.variant === 'dark' && 'white'};
  }
`;

const DropdownComponent = (props: DropdownProps): JSX.Element => {
  const { options, onChange, placeholder, value = '', variant, className } = props;

  const handleOnChange = event => {
    const { selectedIndex } = event.target;
    const index = placeholder ? selectedIndex - 1 : selectedIndex;
    onChange(options[index]);
  };

  return (
    <div className={className}>
      <ArrowIcon variant={variant} />
      <select onChange={handleOnChange} value={value} className="dropdown-select">
        {placeholder && (
          <option disabled hidden value={placeholder}>
            {placeholder}
          </option>
        )}
        {options.map(({ idx, value, title }: DropdownOption, index) => (
          <option key={idx || value + index} value={value}>
            {title || value}
          </option>
        ))}
      </select>
      <label>{value}</label>
    </div>
  );
};

export const Dropdown = React.memo<DropdownProps>(DropdownComponent);
