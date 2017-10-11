import { PropertiesTable } from '../../common-elements/fields-layout';
import * as React from 'react';

import { HeadersCaption } from './styled.elements';
import { mapWithLast } from '../../utils';
import { FieldModel } from '../../services/models';
import { Field } from '../Fields/Field';

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
            <Field isLast={isLast} key={header.name} field={header} />
          ))}
        </tbody>
      </PropertiesTable>
    );
  }
}
