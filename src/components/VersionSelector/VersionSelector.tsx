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

type SelectorState = number | 'Before' | 'After';

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
  const [focusedIdx, setFocusedIdx] = React.useState<SelectorState>('Before');
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

    console.log(key);
    console.log(focusedIdx);

    if (key === 'ArrowDown' || (key === 'Tab' && !shiftKey)) {
      // if we go down when we are already past the end, don't do anything
      if (focusedIdx === 'After') return;

      if (focusedIdx === 'Before') {
        setOpen(true);
        setFocusedIdx(0);
      } else if (focusedIdx === resourceVersions.length - 1) {
        setOpen(false);
        setFocusedIdx('After');
      } else {
        setFocusedIdx(focusedIdx + 1);
      }
    } else if (key === 'ArrowUp' || (key === 'Tab' && shiftKey)) {
      // if we go down when we are already past the end, don't do anything
      if (focusedIdx === 'Before') return;

      if (focusedIdx === 'After') {
        setOpen(true);
        setFocusedIdx(resourceVersions.length - 1);
      } else if (0) {
        setOpen(false);
        setFocusedIdx('Before');
      } else {
        setFocusedIdx(focusedIdx - 1);
      }
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
