import * as React from 'react';

import { isRedocExtension } from '../../utils/openapi';
import { OptionsContext } from '../OptionsProvider';

import { SchemaModel } from '../../services/models';
import { FieldDetail } from './FieldDetail';

export interface ExtensionsProps {
  schema: SchemaModel;
}

export class Extensions extends React.PureComponent<ExtensionsProps> {
  constructor(props) {
    super(props);
    this.getExtensions = this.getExtensions.bind(this);
  }

  getExtensions() {
    const { schema } = this.props;
    const fullSchema = schema.schema;
    return Object.keys(fullSchema).filter(key => key.startsWith('x-') && !isRedocExtension(key));
  }

  render() {
    return (
      <OptionsContext.Consumer>
        {options => (
          <>
            {options.showExtensions &&
              this.getExtensions().map(key => (
                <FieldDetail key={key} label={key} value={this.props.schema.schema[key]} />
              ))}
          </>
        )}
      </OptionsContext.Consumer>
    );
  }
}
