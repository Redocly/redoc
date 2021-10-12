import { PatternLabel, ToggleButton } from '../../common-elements/fields';
import * as React from 'react';
import { OptionsContext } from '../OptionsProvider';
import { useCallback, useContext, useState } from 'react';
import { SchemaModel } from '../../services';

const MAX_PATTERN_LENGTH = 45;

export function Pattern(props: {schema: SchemaModel}) {
  const pattern = props.schema.pattern;
  const { hideSchemaPattern } = useContext(OptionsContext);
  const [patternShown, usePatternShown] = useState(false);
  const togglePattern = useCallback(() => usePatternShown(!patternShown), [patternShown]);

  if (!pattern || hideSchemaPattern) return null;

  return <>
    <PatternLabel>
      {patternShown || pattern.length < MAX_PATTERN_LENGTH
        ? pattern
        : `${pattern.substr(0, MAX_PATTERN_LENGTH)}...`}
    </PatternLabel>
    {pattern.length > MAX_PATTERN_LENGTH && (
      <ToggleButton onClick={togglePattern}>
        {patternShown ? 'Hide pattern' : 'Show pattern'}
      </ToggleButton>
    )}
  </>
}

