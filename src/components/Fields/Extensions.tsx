import * as React from 'react';

import { OptionsContext } from '../OptionsProvider';

import { SchemaModel } from '../../services/models';
import { FieldDetail } from './FieldDetail';

export interface ExtensionsProps {
  schema: SchemaModel;
}

export class Extensions extends React.PureComponent<ExtensionsProps> {
  redocExtensions = [
    'x-circular-ref',
    'x-code-samples',
    'x-displayName',
    'x-examples',
    'x-ignoredHeaderParameters',
    'x-logo',
    'x-nullable',
    'x-servers',
    'x-tagGroups',
    'x-traitTag',
  ];

  render() {
    const { schema } = this.props;
    const fullSchema = schema.schema;
    const extensionList = Object.keys(fullSchema).filter(
      key => key.startsWith('x-') && !this.redocExtensions.includes(key),
    );

    return (
      <OptionsContext.Consumer>
        {options => (
          <>
            {options.showExtensions &&
              extensionList.map(key => (
                <FieldDetail key={key} label={key} value={fullSchema[key]} />
              ))}
          </>
        )}
      </OptionsContext.Consumer>
    );
  }
}
