import { CSSProperties } from 'react';

export interface ActiveVersionData {
  resourceVersion: string;
  apiVersion: string;
}
export interface VersionSelectorProps {
  resourceVersions: string[];
  active: ActiveVersionData;
  rootUrl: string;
  description?: string;
}

export interface OptionProps {
  option: string;
  selected: boolean;
  onClick: () => void;
  focused: boolean;
}

export interface ArrowIconProps {
  open: boolean;
}
