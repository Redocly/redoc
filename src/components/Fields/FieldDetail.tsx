import * as React from 'react';
import { ExampleValue, FieldLabel } from '../../common-elements/fields';

export interface FieldDetailProps {
  value?: any;
  label: string;
  raw?: boolean;
}

function FieldDetailComponent({ value, label, raw }: FieldDetailProps) {
  if (value === undefined) {
    return null;
  }

  const stringifyValue = raw ? String(value) : JSON.stringify(value);

  return (
    <div>
      <FieldLabel> {label} </FieldLabel> <ExampleValue>{stringifyValue}</ExampleValue>
    </div>
  );
}

export const FieldDetail = React.memo<FieldDetailProps>(FieldDetailComponent);
