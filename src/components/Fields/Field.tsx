import { observer } from 'mobx-react';
import * as React from 'react';

import { ClickablePropertyNameCell, OptionalLabel } from '../../common-elements/fields';
import { FieldDetails } from './FieldDetails';

import {
  InnerPropertiesWrap,
  PropertyBullet,
  PropertyCellWithInner,
  PropertyDetailsCell,
  PropertyNameCell,
  PropertyRow,
} from '../../common-elements/fields-layout';

import { Button, ShelfIcon } from '../../common-elements/';

import { FieldModel } from '../../services/models';
import { Schema, SchemaOptions } from '../Schema/Schema';

export interface FieldProps extends SchemaOptions {
  className?: string;
  isLast?: boolean;
  showExamples?: boolean;

  field: FieldModel;

  renderDiscriminatorSwitch?: (opts: FieldProps) => JSX.Element;
}

interface FieldState {
  expanded?: boolean;
}

@observer
export class Field extends React.Component<FieldProps, FieldState> {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  onFocus = () => {
    this.setState({ expanded: true });
  };

  render() {
    const { className, field, isLast } = this.props;
    const { name, deprecated, required, kind } = field;
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
        <Button>
          <ShelfIcon direction={this.state.expanded ? 'down' : 'right'} />
        </Button>
        {!required && <OptionalLabel> optional </OptionalLabel>}
      </ClickablePropertyNameCell>
    ) : (
        <PropertyNameCell className={deprecated ? 'deprecated' : undefined} kind={kind} title={name}>
          <PropertyBullet />
          {name}
          {!required && <OptionalLabel> optional </OptionalLabel>}
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
        {withSubSchema && (
          <PropertyRow className={this.state.expanded ? 'visible' : 'hidden'} key={field.name + 'inner'} onFocus={this.onFocus} tabIndex={1} >
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
          </PropertyRow>
        )}
      </>
    );
  }
}
