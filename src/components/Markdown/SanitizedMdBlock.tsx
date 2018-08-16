import * as DOMPurify from 'dompurify';
import * as React from 'react';

import { OptionsContext } from '../OptionsProvider';
import { StylingMarkdownProps } from './Markdown';
import { StyledMarkdownBlock } from './styled.elements';

const StyledMarkdownSpan = StyledMarkdownBlock.withComponent('span');

const sanitize = (untrustedSpec, html) => (untrustedSpec ? DOMPurify.sanitize(html) : html);

export function SanitizedMarkdownHTML(
  props: StylingMarkdownProps & { html: string; className?: string },
) {
  const Wrap = props.inline ? StyledMarkdownSpan : StyledMarkdownBlock;

  return (
    <OptionsContext.Consumer>
      {options => (
        <Wrap
          className={'redoc-markdown ' + (props.className || '')}
          dangerouslySetInnerHTML={{
            __html: sanitize(options.untrustedSpec, props.html),
          }}
          {...props}
        />
      )}
    </OptionsContext.Consumer>
  );
}
