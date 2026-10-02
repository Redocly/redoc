import { useState } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';

import { EnumExpandToggle, PatternValue } from '../styled.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

const MAX_PATTERN_LENGTH = 45;
const MIN_TRUNCATED_CHARS = 3;

type PatternProps = {
  pattern?: string;
};

export function Pattern({ pattern }: PatternProps): ReactElement | null {
  const { hideSchemaPattern } = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const [isPatternShown, setIsPatternShown] = useState(false);

  if (!pattern || hideSchemaPattern) {
    return null;
  }

  const isTruncatable = pattern.length > MAX_PATTERN_LENGTH + MIN_TRUNCATED_CHARS;
  const displayedPattern =
    isPatternShown || !isTruncatable ? pattern : `${pattern.slice(0, MAX_PATTERN_LENGTH)}...`;

  return (
    <>
      <PatternValue>{displayedPattern}</PatternValue>
      {isTruncatable ? (
        <EnumExpandToggle type="button" onClick={() => setIsPatternShown((shown) => !shown)}>
          {isPatternShown
            ? translate('openapi.hidePattern', 'Hide pattern')
            : translate('openapi.showPattern', 'Show pattern')}
        </EnumExpandToggle>
      ) : null}
    </>
  );
}
