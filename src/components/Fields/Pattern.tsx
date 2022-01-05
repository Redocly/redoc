import React, { useCallback, useContext, useState } from 'react';
import { PatternLabel, ToggleButton } from '../../common-elements/fields';
import { OptionsContext } from '../OptionsProvider';
import { SchemaModel } from '../../services';

const MAX_PATTERN_LENGTH = 45;

export function Pattern(props: { schema: SchemaModel }) {
  const pattern = props.schema.pattern;
  const { hideSchemaPattern } = useContext(OptionsContext);
  const [isPatternShown, setIsPatternShown] = useState(false);
  const togglePattern = useCallback(() => setIsPatternShown(!isPatternShown), [isPatternShown]);

  if (!pattern || hideSchemaPattern) return null;

  return (
    <>
      <PatternLabel>
        {isPatternShown || pattern.length < MAX_PATTERN_LENGTH
          ? pattern
          : `${pattern.substr(0, MAX_PATTERN_LENGTH)}...`}
      </PatternLabel>
      {pattern.length > MAX_PATTERN_LENGTH && (
        <ToggleButton onClick={togglePattern}>
          {isPatternShown ? 'Hide pattern' : 'Show pattern'}
        </ToggleButton>
      )}
    </>
  );
}
