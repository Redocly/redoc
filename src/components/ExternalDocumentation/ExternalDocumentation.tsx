import { observer } from 'mobx-react';
import * as React from 'react';
import styled from '../../styled-components';
import { OpenAPIExternalDocumentation } from '../../types';
import { linksCss } from '../Markdown/styled.elements';

const Link = styled.span`
  ${linksCss};
`;

@observer
export class ExternalDocumentation extends React.Component<{
  externalDocs: OpenAPIExternalDocumentation;
}> {
  render() {
    const { externalDocs } = this.props;
    if (!externalDocs || !externalDocs.url) {
      return null;
    }

    return (
      <Link>
        <a href={externalDocs.url}>{externalDocs.description || externalDocs.url}</a>
      </Link>
    );
  }
}
