import * as React from 'react';
import { highlight } from '../../utils';

import { SampleControls, SampleControlsWrap, StyledPre } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';

export interface SourceCodeProps {
  source: string;
  lang: string;
}

export const SourceCode = (props: SourceCodeProps) => {
  const { source, lang } = props;
  return <StyledPre dangerouslySetInnerHTML={{ __html: highlight(source, lang) }} />;
};

export const SourceCodeWithCopy = (props: SourceCodeProps) => {
  const { source, lang } = props;
  return (
    <CopyButtonWrapper data={source}>
      {({ renderCopyButton }) => (
        <SampleControlsWrap>
          <SampleControls>{renderCopyButton()}</SampleControls>
          <SourceCode lang={lang} source={source} />
        </SampleControlsWrap>
      )}
    </CopyButtonWrapper>
  );
};
