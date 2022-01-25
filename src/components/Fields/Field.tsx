import { observer } from 'mobx-react';
import * as React from 'react';

import { ClickablePropertyNameCell, RequiredLabel } from '../../common-elements/fields';
import { FieldDetails } from './FieldDetails';

import {
  InnerPropertiesWrap,
  PropertyBullet,
  PropertyCellWithInner,
  PropertyDetailsCell,
  PropertyNameCell,
} from '../../common-elements/fields-layout';

import { ShelfIcon } from '../../common-elements/';

import { FieldModel } from '../../services/models';
import { Schema, SchemaOptions } from '../Schema/Schema';

export interface FieldProps extends SchemaOptions {
  className?: string;
  isLast?: boolean;
  showExamples?: boolean;

  field: FieldModel;
  expandByDefault?: boolean;

  renderDiscriminatorSwitch?: (opts: FieldProps) => JSX.Element;
}

export const Field = observer((fieldProps: FieldProps) => {
  const {
    className,
    isLast,
    field,
    expandByDefault,
    skipReadOnly,
    skipWriteOnly,
    showTitle,
    level,
  } = fieldProps;
  const [expanded, setExpanded] = React.useState(
    field.expanded === undefined ? expandByDefault : field.expanded,
  );
  const toggle = () => {
    if (field.expanded === undefined && expandByDefault) {
      field.collapse();
    } else {
      field.toggle();
    }
    setExpanded(field.expanded);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  const { name, deprecated, required, kind } = field;
  const withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;

  const paramName = withSubSchema ? (
    <ClickablePropertyNameCell className={deprecated ? 'deprecated' : ''} kind={kind} title={name}>
      <PropertyBullet />
      <button onClick={toggle} onKeyPress={handleKeyPress} aria-label="expand properties">
        <span>{name}</span>
        <ShelfIcon direction={expanded ? 'down' : 'right'} />
      </button>
      {required && <RequiredLabel> required </RequiredLabel>}
    </ClickablePropertyNameCell>
  ) : (
    <PropertyNameCell className={deprecated ? 'deprecated' : undefined} kind={kind} title={name}>
      <PropertyBullet />
      <span>{name}</span>
      {required && <RequiredLabel> required </RequiredLabel>}
    </PropertyNameCell>
  );

  return (
    <>
      <tr className={isLast ? 'last ' + className : className}>
        {paramName}
        <PropertyDetailsCell>
          <FieldDetails {...fieldProps} />
        </PropertyDetailsCell>
      </tr>
      {expanded && withSubSchema && (
        <tr key={field.name + 'inner'}>
          <PropertyCellWithInner colSpan={2}>
            <InnerPropertiesWrap>
              <Schema
                schema={field.schema}
                skipReadOnly={skipReadOnly}
                skipWriteOnly={skipWriteOnly}
                showTitle={showTitle}
                level={level}
              />
            </InnerPropertiesWrap>
          </PropertyCellWithInner>
        </tr>
      )}
    </>
  );
});
