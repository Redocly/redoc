import { observer } from 'mobx-react';
import * as React from 'react';

import {
  ClickablePropertyNameCell,
  PropertyLabel,
  RequiredLabel,
} from '../../common-elements/fields';
import { FieldDetails } from './FieldDetails';
import {
  InnerPropertiesWrap,
  PropertyBullet,
  PropertyCellWithInner,
  PropertyDetailsCell,
  PropertyNameCell,
} from '../../common-elements/fields-layout';
import { ShelfIcon } from '../../common-elements/';
import { Schema } from '../Schema/Schema';

import type { SchemaOptions } from '../Schema/Schema';
import type { FieldModel } from '../../services/models';

export interface FieldProps extends SchemaOptions {
  className?: string;
  isLast?: boolean;
  showExamples?: boolean;

  field: FieldModel;
  expandByDefault?: boolean;

  renderDiscriminatorSwitch?: (opts: FieldProps) => JSX.Element;
}

@observer
export class Field extends React.Component<FieldProps> {
  toggle = () => {
    if (this.props.field.expanded === undefined && this.props.expandByDefault) {
      this.props.field.collapse();
    } else {
      this.props.field.toggle();
    }
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  };

  render() {
    const { className = '', field, isLast, expandByDefault } = this.props;
    const { name, deprecated, required, kind } = field;
    const withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;

    const expanded = field.expanded === undefined ? expandByDefault : field.expanded;

    const labels = (
      <>
        {kind === 'additionalProperties' && <PropertyLabel>additional property</PropertyLabel>}
        {kind === 'patternProperties' && <PropertyLabel>pattern property</PropertyLabel>}
        {required && <RequiredLabel>required</RequiredLabel>}
      </>
    );

    const paramName = withSubSchema ? (
      <ClickablePropertyNameCell
        className={deprecated ? 'deprecated' : ''}
        kind={kind}
        title={name}
      >
        <PropertyBullet />
        <button
          onClick={this.toggle}
          onKeyPress={this.handleKeyPress}
          aria-label={`expand ${name}`}
        >
          <span className="property-name">{name}</span>
          <ShelfIcon direction={expanded ? 'down' : 'right'} />
        </button>
        {labels}
      </ClickablePropertyNameCell>
    ) : (
      <PropertyNameCell className={deprecated ? 'deprecated' : undefined} kind={kind} title={name}>
        <PropertyBullet />
        <span className="property-name">{name}</span>
        {labels}
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
        {expanded && withSubSchema && (
          <tr key={field.name + 'inner'}>
            <PropertyCellWithInner colSpan={2}>
              <InnerPropertiesWrap>
                <Schema
                  schema={field.schema}
                  skipReadOnly={this.props.skipReadOnly}
                  skipWriteOnly={this.props.skipWriteOnly}
                  showTitle={this.props.showTitle}
                  level={this.props.level}
                />
              </InnerPropertiesWrap>
            </PropertyCellWithInner>
          </tr>
        )}
      </>
    );
  }
}
