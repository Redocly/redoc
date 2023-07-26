import * as DOMPurify from 'dompurify';
import * as React from 'react';

import { OptionsConsumer } from '../OptionsProvider';
import { StylingMarkdownProps } from './Markdown';
import { StyledMarkdownBlock } from './styled.elements';
import styled from 'styled-components';

const StyledMarkdownSpan = styled(StyledMarkdownBlock)`
  display: inline;
`;

const sanitize = (untrustedSpec, html) => (untrustedSpec ? DOMPurify.sanitize(html) : html);

export function SanitizedMarkdownHTML(
  props: StylingMarkdownProps & { html: string; className?: string; 'data-role'?: string },
) {
  const Wrap = props.inline ? StyledMarkdownSpan : StyledMarkdownBlock;

  return (
    <OptionsConsumer>
      {options => (
        <Wrap
          className={'redoc-markdown ' + (props.className || '')}
          dangerouslySetInnerHTML={{
            __html: sanitize(options.untrustedSpec, props.html),
          }}
          data-role={props['data-role']}
          {...props}
        />
      )}
    </OptionsConsumer>
  );
}
