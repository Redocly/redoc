import * as React from 'react';
import styled from '../../styled-components';
import { highlight } from '../../utils';

const StyledPre = styled.pre`
  font-family: ${props => props.theme.code.fontFamily};
  font-size: ${props => props.theme.code.fontSize};
  overflow-x: auto;
  font-size: 0.9em;
`;

export interface SourceCodeProps {
  source: string;
  lang: string;
}

export class SourceCode extends React.PureComponent<SourceCodeProps> {
  render() {
    const { source, lang } = this.props;
    return <StyledPre dangerouslySetInnerHTML={{ __html: highlight(source, lang) }} />;
  }
}
