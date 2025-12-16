export interface SelectOption {
  idx?: number;
  value: string;
  title?: string;
  serverUrl?: string;
  label?: string;
}

export interface SelectProps {
  options: SelectOption[];
  onChange: (option: SelectOption) => void;
  handleClear?: () => void;
  clearable?: boolean;
  ariaLabel?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  dense?: boolean;
  fullWidth?: boolean;
  variant?: 'dark' | 'light';
}
