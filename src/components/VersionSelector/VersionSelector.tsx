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
  const [focusedIdx, setFocusedIdx] = React.useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = React.useState<number>(initialSelectedIdx);

  const menuListRef = React.useRef(null);

  const options = resourceVersions.map((option, i) => {
    return (
      <Option
        key={`option-${i}`}
        selected={i === selectedIdx}
        focused={i === focusedIdx && focusedIdx !== selectedIdx}
        option={option}
        onClick={() => handleClick(i)}
      />
    );
  });

  useOutsideClick(menuListRef, () => {
    if (open) setOpen(false);
  });

  const handleClick = (idx: number) => {
    setSelectedIdx(idx);
    setOpen(false);
  };

  const handleFocusChange = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.key);
  };

  return (
    <StyledWrapper ref={menuListRef}>
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

      <StyledDropdown open={open} onKeyDown={handleFocusChange}>
        <div>
          <StyledMenuList>{options}</StyledMenuList>
        </div>
      </StyledDropdown>
    </StyledWrapper>
  );
};

export const VersionSelector = React.memo<VersionSelectorProps>(VersionSelectorComponent);
