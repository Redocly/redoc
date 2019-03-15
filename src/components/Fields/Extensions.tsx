import * as React from 'react';

import { ExtensionValue, FieldLabel } from '../../common-elements/fields';

import styled from '../../styled-components';

import { OptionsContext } from '../OptionsProvider';

import { StyledMarkdownBlock } from '../Markdown/styled.elements';

const Extension = styled(StyledMarkdownBlock)`
  margin: 2px 0;
`;

export interface ExtensionsProps {
  extensions: {
    [k: string]: any;
  };
}

export class Extensions extends React.PureComponent<ExtensionsProps> {
  render() {
    const exts = this.props.extensions;
    return (
      <OptionsContext.Consumer>
        {options => (
          <>
            {options.showExtensions &&
              Object.keys(exts).map(key => (
                <Extension key={key}>
                  <FieldLabel> {key.substring(2)}: </FieldLabel>{' '}
                  <ExtensionValue>
                    {typeof exts[key] === 'string' ? exts[key] : JSON.stringify(exts[key])}
                  </ExtensionValue>
                </Extension>
              ))}
          </>
        )}
      </OptionsContext.Consumer>
    );
  }
}
