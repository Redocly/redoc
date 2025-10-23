import { useState } from 'react';

import type { ReactElement } from 'react';

import { Tag, ToggleButton } from '../common/index.js';
import { useTranslate } from '../../hooks/index.js';

interface PatternProps {
  pattern?: string;
}

const MAX_PATTERN_LENGTH = 45;

export function Pattern({ pattern }: PatternProps): ReactElement | null {
  const translate = useTranslate();
  const [isPatternShown, setIsPatternShown] = useState<boolean>(false);

  if (!pattern) {
    return null;
  }

  const togglePattern = (): void => {
    setIsPatternShown(!isPatternShown);
  };

  return (
    <>
      <Tag>
        {isPatternShown || pattern.length < MAX_PATTERN_LENGTH
          ? pattern
          : `${pattern.slice(0, MAX_PATTERN_LENGTH)}...`}
      </Tag>
      {pattern.length > MAX_PATTERN_LENGTH && (
        <ToggleButton onClick={togglePattern}>
          {isPatternShown
            ? translate('openapi.hidePattern', 'Hide pattern')
            : translate('openapi.showPattern', 'Show pattern')}
        </ToggleButton>
      )}
    </>
  );
}
