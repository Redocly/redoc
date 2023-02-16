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
  StyledSelected,
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
  const [selectedIdx, setSelectedIdx] = React.useState<number>(initialSelectedIdx);
  const menuListRef = React.useRef(null);
  useOutsideClick(menuListRef, () => {
    if (open) setOpen(false);
  });

  const handleClick = (idx: number) => {
    setSelectedIdx(idx);
    setOpen(false);
  };

  return (
    <StyledWrapper ref={menuListRef}>
      <StyledSelectWrapper>
        <StyledLabel>Version Selector: v{active.apiVersion}</StyledLabel>
        {description && <StyledDescription>{description}</StyledDescription>}
        <StyledButton onClick={() => setOpen(!open)}>
          <StyledDisplay>
            <StyledSelected>{resourceVersions[selectedIdx]}</StyledSelected>
            <ArrowIcon open={open} />
          </StyledDisplay>
        </StyledButton>
      </StyledSelectWrapper>

      <StyledDropdown open={open}>
        <div>
          <StyledMenuList>
            {resourceVersions.map((option, i) => (
              <Option
                key={`option-${i}`}
                selected={i === selectedIdx}
                option={option}
                onClick={() => handleClick(i)}
              />
            ))}
          </StyledMenuList>
        </div>
      </StyledDropdown>
    </StyledWrapper>
  );
};

export const VersionSelector = React.memo<VersionSelectorProps>(VersionSelectorComponent);
