import * as React from 'react';
import { FieldDetails } from './FieldDetails';

import { ClickablePropertyNameCell, RequiredLabel } from '../../common-elements/fields';

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

  renderDiscriminatorSwitch?: (opts: FieldProps) => JSX.Element;
}

export class Field extends React.PureComponent<FieldProps> {
  toggle = () => {
    this.props.field.toggle();
  };
  render() {
    const { className, field, isLast } = this.props;
    const { name, expanded, deprecated, required, kind } = field;
    const withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;

    const paramName = withSubSchema ? (
      <ClickablePropertyNameCell
        onClick={this.toggle}
        className={deprecated ? 'deprecated' : ''}
        kind={kind}
        title={name}
      >
        <PropertyBullet />
        {name}
        <ShelfIcon size={'1.2em'} direction={expanded ? 'down' : 'right'} />
        {required && <RequiredLabel> required </RequiredLabel>}
      </ClickablePropertyNameCell>
    ) : (
      <PropertyNameCell className={deprecated ? 'deprecated' : undefined} kind={kind} title={name}>
        <PropertyBullet />
        {name}
        {required && <RequiredLabel> required </RequiredLabel>}
      </PropertyNameCell>
    );

    return (
      <>
        <tr className={isLast ? 'last ' + className : className}>
          {paramName}
          <PropertyDetailsCell>
            <FieldDetails {...this.props} />
          </PropertyDetailsCell>
        </tr>
        {field.expanded &&
          withSubSchema && (
            <tr key={field.name + 'inner'}>
              <PropertyCellWithInner colSpan={2}>
                <InnerPropertiesWrap>
                  <Schema
                    schema={field.schema}
                    skipReadOnly={this.props.skipReadOnly}
                    skipWriteOnly={this.props.skipWriteOnly}
                    showTitle={this.props.showTitle}
                  />
                </InnerPropertiesWrap>
              </PropertyCellWithInner>
            </tr>
          )}
      </>
    );
  }
}
