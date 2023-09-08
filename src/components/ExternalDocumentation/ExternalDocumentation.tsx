import { observer } from 'mobx-react';
import * as React from 'react';
import styled from '../../styled-components';
import { OpenAPIExternalDocumentation } from '../../types';
import { linksCss } from '../Markdown/styled.elements';

const LinkWrap = styled.div<{ $compact?: boolean }>`
  ${linksCss};
  ${({ $compact }) => (!$compact ? 'margin: 1em 0' : '')}
`;

@observer
export class ExternalDocumentation extends React.Component<{
  externalDocs: OpenAPIExternalDocumentation;
  compact?: boolean;
}> {
  render() {
    const { externalDocs } = this.props;
    if (!externalDocs || !externalDocs.url) {
      return null;
    }

    return (
      <LinkWrap $compact={this.props.compact}>
        <a href={externalDocs.url}>{externalDocs.description || externalDocs.url}</a>
      </LinkWrap>
    );
  }
}
