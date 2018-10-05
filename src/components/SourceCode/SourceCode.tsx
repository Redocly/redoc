import * as React from 'react';
import { highlight } from '../../utils';

import { SampleControls, SampleControlsWrap } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';
import { PrismDiv } from '../../common-elements/PrismDiv';
import styled from '../../styled-components';

const StyledPre = styled(PrismDiv.withComponent('pre'))`
  font-family: ${props => props.theme.typography.code.fontFamily};
  font-size: ${props => props.theme.typography.code.fontSize};
  overflow-x: auto;
  margin: 0;

  white-space: ${({ theme }) => (theme.typography.code.wrap ? 'pre-wrap' : 'pre')};
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

export class SourceCodeWithCopy extends React.PureComponent<SourceCodeProps> {
  render() {
    return (
      <CopyButtonWrapper data={this.props.source}>
        {({ renderCopyButton }) => (
          <SampleControlsWrap>
            <SampleControls>{renderCopyButton()}</SampleControls>
            <SourceCode lang={this.props.lang} source={this.props.source} />
          </SampleControlsWrap>
        )}
      </CopyButtonWrapper>
    );
  }
}
