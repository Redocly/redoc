import * as React from 'react';
import styled from '../../styled-components';

import { OptionsContext } from '../OptionsProvider';

import { StyledMarkdownBlock } from '../Markdown/styled.elements';

const Extension = styled(StyledMarkdownBlock)`
  opacity: 0.9;
  margin: 2px 0;
`;

const ExtensionLable = styled.span`
  font-style: italic;
`;

export interface ExtensionsProps {
  extensions: {
    [k: string]: any;
  };
}

export class Extensions extends React.PureComponent<ExtensionsProps> {
  render() {
    return (
      <OptionsContext.Consumer>
        {options => (
          <>
            {options.showExtensions &&
              Object.keys(this.props.extensions).map(key => (
                <Extension key={key}>
                  <ExtensionLable>{key}</ExtensionLable>:{' '}
                  <code>{JSON.stringify(this.props.extensions[key])}</code>
                </Extension>
              ))}
          </>
        )}
      </OptionsContext.Consumer>
    );
  }
}
