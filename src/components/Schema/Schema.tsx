import { observer } from 'mobx-react';
import * as React from 'react';
import { DISCRIMINATOR_SEPARATOR, PROPERTY_SEPARATOR } from '../../constants';

import { RecursiveLabel, TypeName, TypeTitle } from '../../common-elements/fields';
import { FieldDetails } from '../Fields/FieldDetails';

import { FieldModel, SchemaModel } from '../../services/models';

import { ArraySchema } from './ArraySchema';
import { ObjectSchema } from './ObjectSchema';
import { OneOfSchema } from './OneOfSchema';

import { l } from '../../services/Labels';
import { getLocationHash, isArray } from '../../utils/helpers';

export interface SchemaOptions {
  showTitle?: boolean;
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  level?: number;
  operationHash?: string;
}

export interface SchemaProps extends SchemaOptions {
  schema: SchemaModel;
}

@observer
export class Schema extends React.Component<Partial<SchemaProps>, { discriminator: number }> {
  /**
   * Set specified alternative schema as active
   * @param idx oneOf index
   */
  setDiscriminator(idx: number) {
    this.setState({
      discriminator: idx,
    });
  }

  constructor(props) {
    super(props);

    const { operationHash } = props;
    const locationHash = getLocationHash();
    let discriminator = 0;
    // search for discriminator for current operation
    if (operationHash && locationHash.indexOf(`${operationHash}${DISCRIMINATOR_SEPARATOR}`) === 0) {
      // cut off operationHash
      const discriminatorWithProps = locationHash.slice(
        `${operationHash}${DISCRIMINATOR_SEPARATOR}`.length,
      );
      discriminator = +discriminatorWithProps.split(PROPERTY_SEPARATOR)[0];
    }

    this.state = {
      discriminator,
    };
  }

  render() {
    const { schema, operationHash, ...rest } = this.props;
    const level = (rest.level || 0) + 1;
    let operationHashWithDiscriminator = operationHash;
    if (this.state.discriminator > 0) {
      operationHashWithDiscriminator += `${DISCRIMINATOR_SEPARATOR}${this.state.discriminator}`;
    }

    if (!schema) {
      return <em> Schema not provided </em>;
    }
    const { type, oneOf, discriminatorProp, isCircular } = schema;

    if (isCircular) {
      return (
        <div>
          <TypeName>{schema.displayType}</TypeName>
          {schema.title && <TypeTitle> {schema.title} </TypeTitle>}
          <RecursiveLabel> {l('recursive')} </RecursiveLabel>
        </div>
      );
    }

    if (discriminatorProp !== undefined) {
      if (!oneOf || !oneOf.length) {
        console.warn(
          `Looks like you are using discriminator wrong: you don't have any definition inherited from the ${schema.title}`,
        );
        return null;
      }
      return (
        <ObjectSchema
          {...rest}
          level={level}
          schema={oneOf![this.state.discriminator]}
          discriminator={{
            fieldName: discriminatorProp,
            parentSchema: schema,
          }}
          operationHash={operationHashWithDiscriminator}
          discriminatorValue={this.state.discriminator}
          onChangeDiscriminator={this.setDiscriminator.bind(this)}
        />
      );
    }

    if (oneOf !== undefined) {
      return (
        <OneOfSchema
          discriminatorValue={this.state.discriminator}
          onChangeDiscriminator={this.setDiscriminator.bind(this)}
          schema={schema}
          {...rest}
        />
      );
    }

    const types = isArray(type) ? type : [type];
    if (types.includes('object')) {
      if (schema.fields?.length) {
        return (
          <ObjectSchema
            {...(this.props as any)}
            operationHash={operationHashWithDiscriminator}
            level={level}
            discriminatorValue={this.state.discriminator}
            onChangeDiscriminator={this.setDiscriminator}
          />
        );
      }
    } else if (types.includes('array')) {
      return (
        <ArraySchema
          {...(this.props as any)}
          level={level}
          operationHash={operationHashWithDiscriminator}
        />
      );
    }

    // TODO: maybe adjust FieldDetails to accept schema
    const field = {
      schema,
      name: '',
      required: false,
      description: schema.description,
      externalDocs: schema.externalDocs,
      deprecated: false,
      toggle: () => null,
      expanded: false,
    } as any as FieldModel; // cast needed for hot-loader to not fail

    return (
      <div>
        <FieldDetails field={field} />
      </div>
    );
  }
}
