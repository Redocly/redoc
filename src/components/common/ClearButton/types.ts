import type { CSSProperties } from 'react';

export interface ClearButtonProps {
  className?: string;
  style?: CSSProperties;
  handleClear?: () => void;
}
