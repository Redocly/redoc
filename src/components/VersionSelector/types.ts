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
  value: string;
  selected: boolean;
  onClick: (option: string) => void;
}

export interface ArrowIconProps {
  open: boolean;
}
