import { memo, useMemo } from 'react';

import type { SelectProps, SelectOption } from './types.js';

import { ClearButton } from '../ClearButton/index.js';
import { normalizeText } from '../../../utils/index.js';
import { Arrow } from './styled.js';

function SelectComponent({
  options,
  onChange,
  handleClear,
  clearable,
  placeholder,
  value = '',
  className,
}: SelectProps) {
  const handleChange = (event) => {
    const { selectedIndex } = event.target;
    const index = placeholder || !value ? selectedIndex - 1 : selectedIndex;
    onChange(options[index]);
  };

  const renderOptions = useMemo(
    () =>
      options.map(({ idx, value, title }: SelectOption, index) => {
        const normalizedValue = normalizeText(value);
        return (
          <option
            key={idx || normalizedValue + index}
            value={normalizedValue}
            className="dropdown-option"
          >
            {title || normalizedValue}
          </option>
        );
      }),
    [options],
  );

  const normalizedValue = normalizeText(value);
  const title = options.find((option) => option.value === value)?.title || normalizedValue;

  return (
    <div className={className + ' dropdown-wrapper'}>
      <Arrow />
      {clearable && normalizedValue?.length > 0 && <ClearButton handleClear={handleClear} />}
      <select
        onChange={handleChange}
        value={normalizedValue}
        className="dropdown-select"
        aria-label="dropdown select"
      >
        {placeholder && (
          <option disabled hidden value={placeholder}>
            {placeholder}
          </option>
        )}
        {!normalizedValue && !placeholder && <option disabled />}
        {renderOptions}
      </select>
      <label>{title}</label>
    </div>
  );
}

export const Select = memo<SelectProps>(SelectComponent);
