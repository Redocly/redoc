import { palette } from '@leafygreen-ui/palette';
import { transparentize } from 'polished';
import styled, { css } from '../../styled-components';
import { ArrowSvg } from './ArrowSvg';
import { ArrowIconProps } from './types';

const transitionDuration = {
  faster: 100,
  default: 150,
  slower: 300,
} as const;

export const ArrowIcon = styled(ArrowSvg)`
  position: absolute;
  pointer-events: none;
  z-index: 1;
  top: 50%;
  -webkit-transform: ${(props: ArrowIconProps) =>
    props.open ? `translateY(-50%) rotate(180deg)` : `translateY(-50%)`};
  -ms-transform: ${(props: ArrowIconProps) =>
    props.open ? `translateY(-50%) rotate(180deg)` : `translateY(-50%)`};
  transform: ${(props: ArrowIconProps) =>
    props.open ? `translateY(-50%) rotate(180deg)` : `translateY(-50%)`};
  right: 8px;
  margin: auto;
  text-align: center;
`;

export const StyledWrapper = styled.div`
  font-family: 'Euclid Circular A', Akzidenz, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;

  width: 90%;
  margin: 8px 5% 8px 5%;
  position: relative;
`;

export const StyledSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > label + button,
  > p + button {
    margin-top: 3px;
  }
`;

export const StyledButton = styled.button.attrs({
  'aria-labelledby': 'View a different version of documentation.',
})`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 36px;
  margin: 8px 0;

  background-color: white;
  color: ${palette.black};
  border: 1px solid transparent;
  border-radius: 6px;
  border-color: ${palette.gray.base};

  &:hover,
  &:active {
    color: ${palette.black};
    background-color: ${palette.white};
    box-shadow: 0 0 0 3px ${palette.gray.light2};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${palette.blue.light1};
    border-color: rgba(255, 255, 255, 0);
  }
`;

export const StyledLabel = styled.label`
  pointer-events: none;
  line-height: 20px;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const StyledDescription = styled.p`
  margin: 0;
`;

export const StyledMenuList = styled.ul`
  position: relative;
  text-align: left;
  width: 100%;
  border-radius: 12px;
  line-height: 16px;
  list-style: none;
  margin: 0;
  padding: 8px 0px;
  overflow: auto;
  box-shadow: 0 4px 7px 0 ${transparentize(0.75, palette.black)};
  border: ${palette.gray.light2};
`;

export const StyledDisplay = styled.div`
  display: grid;
  grid-template-columns: 1fr 16px;
  gap: 6px;
  padding: 0 4px 0 12px;
`;

export const disabledOptionStyle = css`
  cursor: not-allowed;
  color: ${palette.gray.base};
`;

export const enabledOptionStyle = css`
  &:hover {
    background-color: ${palette.gray.light2};
  }
`;

export const StyledLi = styled.li.attrs<{
  selected: boolean;
  disabled?: boolean;
  focused?: boolean;
}>(({ selected }) => ({
  role: 'option',
  'aria-selected': selected,
  tabIndex: '0',
}))<{ selected: boolean; disabled?: boolean; focused?: boolean }>`
  display: flex;
  width: 100%;
  outline: none;
  overflow-wrap: anywhere;
  transition: background-color ${transitionDuration.default}ms ease-in-out;
  position: relative;
  padding: 8px 12px;
  cursor: pointer;
  color: ${palette.gray.dark3};
  ${props =>
    props.focused &&
    `color: ${palette.blue.dark2};
    background-color: ${palette.blue.light3};`}
  font-weight: ${props => (props.selected ? `bold` : `normal`)};

  &:before {
    content: '';
    position: absolute;
    transform: scaleY(0.3);
    top: 7px;
    bottom: 7px;
    left: 0;
    right: 0;
    width: 4px;
    border-radius: 0px 4px 4px 0px;
    opacity: 0;
    transition: all ${transitionDuration.default}ms ease-in-out;
    ${props =>
      props.focused &&
      `
      opacity: 1;
      transform: scaleY(1);
      background-color: ${palette.blue.base};
      `}
  }

  ${props => (props.disabled ? disabledOptionStyle : enabledOptionStyle)}
`;

export const StyledOptionText = styled.span`
  display: flex;
  align-items: center;
`;

export const openDropdownStyle = css`
  position: absolute;
  top: 70px;
  left: 1px;
  display: block;
  width: 100%;
  pointer-events: initial;
  z-index: 2;
  background-color: ${palette.white};
`;

export const StyledDropdown = styled.div.attrs<{ open: boolean }>({
  role: 'listbox',
  'aria-labelledby': 'View a different version of documentation.',
  tabIndex: '-1',
})<{ open: boolean }>`
  ${props => (props.open ? openDropdownStyle : `display: none;`)}
`;

export const StyledPlaceholder = styled.span`
  width: 16px;
  height: 16px;
  margin-right: 6px;
`;
