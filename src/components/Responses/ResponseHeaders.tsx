import * as React from 'react';
import { PropertiesTable } from '../../common-elements/fields-layout';

import { FieldModel } from '../../services/models';
import { mapWithLast } from '../../utils';
import { Field } from '../Fields/Field';
import { HeadersCaption } from './styled.elements';

export interface ResponseHeadersProps {
  headers?: FieldModel[];
}

export class ResponseHeaders extends React.PureComponent<ResponseHeadersProps> {
  render() {
    const { headers } = this.props;
    if (headers === undefined || headers.length === 0) {
      return null;
    }
    return (
      <PropertiesTable>
        <HeadersCaption> Response Headers </HeadersCaption>
        <tbody>
          {mapWithLast(headers, (header, isLast) => (
            <Field isLast={isLast} key={header.name} field={header} showExamples={true} />
          ))}
        </tbody>
      </PropertiesTable>
    );
  }
}
