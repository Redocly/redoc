import * as React from 'react';
import { highlight } from '../../utils';

import { SampleControls, SampleControlsWrap, StyledPre } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';

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

export class SourceCodeWithCopy extends React.Component<SourceCodeProps> {
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
