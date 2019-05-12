export interface LabelsConfig {
  enum: string;
  enumSingleValue: string;
  enumArray: string;
  default: string;
  deprecated: string;
  example: string;
  nullable: string;
  recursive: string;
  arrayOf: string;
}

export type LabelsConfigRaw = Partial<LabelsConfig>;

const labels: LabelsConfig = {
  enum: 'Enum',
  enumSingleValue: 'Value',
  enumArray: 'Items',
  default: 'Default',
  deprecated: 'Deprecated',
  example: 'Example',
  nullable: 'Nullable',
  recursive: 'Recursive',
  arrayOf: 'Array of ',
};

export function setRedocLabels(_labels?: LabelsConfigRaw) {
  Object.assign(labels, _labels);
}

export function l(key: keyof LabelsConfig, idx?: number): string {
  const label = labels[key];
  if (idx !== undefined) {
    return label[idx];
  }
  return label;
}
