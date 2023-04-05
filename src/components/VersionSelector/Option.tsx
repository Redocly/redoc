import * as React from 'react';
import { StyledLi, StyledOptionText, StyledPlaceholder } from './styled.elements';
import Checkmark from './CheckmarkSvg';
import { OptionProps } from './types';

export const Option = ({ option, value, selected, onClick, focused }: OptionProps) => {
  const KEY_ENTER = 'Enter';
  const KEY_SPACE = ' ';

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === KEY_ENTER || event.key === KEY_SPACE) {
      onClick(value);
    }
  };

  return (
    <StyledLi
      onClick={() => onClick(value)}
      onKeyPress={handleKeyPress}
      selected={selected}
      focused={focused}
    >
      {selected ? <Checkmark /> : <StyledPlaceholder />}
      <StyledOptionText>{option}</StyledOptionText>
    </StyledLi>
  );
};
