import * as React from 'react';

import { UnderlinedHeader } from '../../common-elements';
import { PropertiesTable } from '../../common-elements/fields-layout';

import { FieldModel } from '../../services/models';
import { Field } from '../Fields/Field';

import { mapWithLast } from '../../utils';

export interface ParametersGroupProps {
  place: string;
  parameters: FieldModel[];
  operationHash?: string;
}

export class ParametersGroup extends React.PureComponent<ParametersGroupProps, any> {
  render() {
    const { place, parameters, operationHash } = this.props;
    if (!parameters || !parameters.length) {
      return null;
    }

    return (
      <div key={place}>
        <UnderlinedHeader>{place} Parameters</UnderlinedHeader>
        <PropertiesTable>
          <tbody>
            {mapWithLast(parameters, (field, isLast) => (
              <Field
                key={field.name}
                isLast={isLast}
                field={field}
                showExamples={true}
                operationHash={operationHash}
              />
            ))}
          </tbody>
        </PropertiesTable>
      </div>
    );
  }
}
