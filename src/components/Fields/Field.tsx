import { observer } from 'mobx-react';
import * as React from 'react';
import { StoreContext } from '../../components/StoreBuilder';
import { AppStore, SECTION_ATTR } from '../../services';

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

import { ShareLink, ShelfIcon } from '../../common-elements/';

import { FieldModel } from '../../services/models';
import { Schema, SchemaOptions } from '../Schema/Schema';

export interface FieldProps extends SchemaOptions {
  className?: string;
  isLast?: boolean;
  showExamples?: boolean;
  operationHash?: string;

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
    const { className = '', field, isLast, expandByDefault, operationHash } = this.props;
    const { name, deprecated, required, kind } = field;
    const withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;

    const appStore: AppStore = this.context;

    const expanded = field.expanded === undefined ? expandByDefault : field.expanded;
    const propertyHref = `${operationHash}|${name}`;
    const isActiveProperty = appStore.menu.activeItemHash === propertyHref;

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
        <ShareLink to={propertyHref} />
        <PropertyBullet />
        <button
          onClick={this.toggle}
          onKeyPress={this.handleKeyPress}
          aria-label="expand properties"
        >
          <span className="property-name">{name}</span>
          <ShelfIcon direction={expanded ? 'down' : 'right'} />
        </button>
        {labels}
      </ClickablePropertyNameCell>
    ) : (
      <PropertyNameCell className={deprecated ? 'deprecated' : undefined} kind={kind} title={name}>
        <ShareLink to={propertyHref} />
        <PropertyBullet />
        <span className="property-name">{name}</span>
        {labels}
      </PropertyNameCell>
    );

    return (
      <>
        <tr
          className={isLast ? 'last ' + className : className}
          {...{ [SECTION_ATTR]: propertyHref }}
          style={{
            backgroundColor: isActiveProperty ? '#faebd7' : undefined,
          }}
        >
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
                  operationHash={propertyHref}
                />
              </InnerPropertiesWrap>
            </PropertyCellWithInner>
          </tr>
        )}
      </>
    );
  }
}
Field.contextType = StoreContext;
