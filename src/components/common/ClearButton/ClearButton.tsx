import { memo } from 'react';

import type { ReactElement } from 'react';
import type { ClearButtonProps } from './types.js';

const ClearButtonComponent = ({
  className,
  style,
  handleClear,
}: ClearButtonProps): ReactElement => (
  <button className={className} style={style} onClick={handleClear}>
    ✕
  </button>
);

export const ClearButton = memo<ClearButtonProps>(ClearButtonComponent);
