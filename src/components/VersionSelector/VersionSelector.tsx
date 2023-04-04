import * as React from 'react';
import {
  ArrowIcon,
  StyledWrapper,
  StyledSelectWrapper,
  StyledButton,
  StyledLabel,
  StyledDescription,
  StyledMenuList,
  StyledDisplay,
  StyledDropdown,
} from './styled.elements';
import { Option } from './Option';
import { VersionSelectorProps } from './types';
import { useOutsideClick } from './use-outside-click';

/**
 * Version Selector Dropdown component based structurally and stylistically off LG Select
 */
const VersionSelectorComponent = ({
  resourceVersions,
  active,
  description,
}: VersionSelectorProps): JSX.Element => {
  const initialSelectedIdx = resourceVersions.indexOf(active.resourceVersion);
  const [open, setOpen] = React.useState<boolean>(false);
  const [focusedIdx, setFocusedIdx] = React.useState<number>(-1);
  const [selectedIdx, setSelectedIdx] = React.useState<number>(initialSelectedIdx);

  const menuListRef = React.useRef(null);

  const options = resourceVersions.map((option, i) => {
    return (
      <Option
        key={`option-${i}`}
        selected={i === selectedIdx}
        focused={i === focusedIdx}
        option={option}
        onClick={() => handleClick(i)}
      />
    );
  });

  useOutsideClick(menuListRef, () => {
    console.log('outside click');
    if (open) setOpen(false);
    setFocusedIdx(0);
  });

  const handleClick = (idx: number) => {
    setSelectedIdx(idx);
    setOpen(false);
  };

  const handleFocusChange = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key, shiftKey } = event;

    if (key === 'ArrowDown' || (key === 'Tab' && !shiftKey)) {
      // if we go down when we are already past the end, don't do anything
      if (focusedIdx === resourceVersions.length) return;

      if (focusedIdx === -1) {
        // when first entering the dropdown via the down arrow key or tab,
        // we want to open the modal
        setOpen(true);
      } else if (focusedIdx === resourceVersions.length - 1) {
        // if we are at the last element of the dropdown, and attempt to go
        // down again, we want to close the dropdown
        setOpen(false);
      }
      setFocusedIdx(focusedIdx + 1);
    } else if (key === 'ArrowUp' || (key === 'Tab' && shiftKey)) {
      // if we go down when we are already past the end, don't do anything
      if (focusedIdx === -1) return;

      if (focusedIdx === resourceVersions.length) {
        // in this scenario, we are entering the dropdown from below
        // we open the dropdown and start from the bottom
        setOpen(true);
      } else if (focusedIdx === 0) {
        // if we reach the first element in the drop down, and we attempt to go up again,
        // we want to close the dropdown
        setOpen(false);
      }

      setFocusedIdx(focusedIdx - 1);
    }
  };

  return (
    <StyledWrapper onKeyDown={handleFocusChange} ref={menuListRef}>
      <StyledSelectWrapper>
        <StyledLabel>Version Selector: v{active.apiVersion}</StyledLabel>
        {description && <StyledDescription>{description}</StyledDescription>}
        <StyledButton onClick={() => setOpen(!open)}>
          <StyledDisplay>
            <div>
              <div>{resourceVersions[selectedIdx]}</div>
            </div>
            <ArrowIcon open={open} />
          </StyledDisplay>
        </StyledButton>
      </StyledSelectWrapper>

      <StyledDropdown open={open}>
        <div>
          <StyledMenuList>{options}</StyledMenuList>
        </div>
      </StyledDropdown>
    </StyledWrapper>
  );
};

export const VersionSelector = React.memo<VersionSelectorProps>(VersionSelectorComponent);
