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
  rootUrl,
  description,
}: VersionSelectorProps): JSX.Element => {
  const [selectedIdx, setSelectedIdx] = React.useState(
    resourceVersions.indexOf(active.resourceVersion),
  );
  const [open, setOpen] = React.useState<boolean>(false);
  const menuListRef = React.useRef(null);
  useOutsideClick(menuListRef, () => {
    if (open) setOpen(false);
  });

  const handleClick = (idx: number, resourceVersion: string) => {
    if (idx === selectedIdx) return setOpen(false);

    // navigate to resource version spec
    let selectedResourceVersionUrl = `${rootUrl}/${resourceVersion}`;
    const anchorTagIdx = window.location.href.indexOf('#tag');
    if (anchorTagIdx > -1) {
      selectedResourceVersionUrl += window.location.href.slice(anchorTagIdx);
    }
    window.location.href = selectedResourceVersionUrl;
    setSelectedIdx(idx);
    return setOpen(false);
  };

  return (
    <StyledWrapper ref={menuListRef}>
      <StyledSelectWrapper>
        <StyledLabel>Resource Version:</StyledLabel>
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
                value={option}
                option={`${option}${i === resourceVersions.length - 1 ? ' (latest)' : ''}`}
                onClick={option => handleClick(i, option)}
              />
            ))}
          </StyledMenuList>
        </div>
      </StyledDropdown>
    </StyledWrapper>
  );
};

export const VersionSelector = React.memo<VersionSelectorProps>(VersionSelectorComponent);
