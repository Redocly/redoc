import * as React from 'react';
import styled, { ResolvedThemeInterface, StyledComponentClass } from '../../styled-components';

import * as DOMPurify from 'dompurify';
import { AppStore, MarkdownRenderer, MDXComponentMeta } from '../../services';
import { OptionsContext } from '../OptionsProvider';

import { StyledMarkdownBlock } from './styled.elements';

const StyledMarkdownSpan = StyledMarkdownBlock.withComponent('span');

export interface StylingMarkdownProps {
  dense?: boolean;
  inline?: boolean;
}

export interface BaseMarkdownProps extends StylingMarkdownProps {
  raw?: boolean;
  sanitize?: boolean;
  store?: AppStore;
}

const sanitize = (untrustedSpec, html) => (untrustedSpec ? DOMPurify.sanitize(html) : html);

function SanitizedMarkdownHTML(props: StylingMarkdownProps & { html: string }) {
  const Wrap = props.inline ? StyledMarkdownSpan : StyledMarkdownBlock;

  return (
    <OptionsContext.Consumer>
      {options => (
        <Wrap
          className={'redoc-markdown'}
          dangerouslySetInnerHTML={{
            __html: sanitize(options.untrustedSpec, props.html),
          }}
          {...props}
        />
      )}
    </OptionsContext.Consumer>
  );
}

export interface MarkdownProps extends BaseMarkdownProps {
  allowedComponents?: Dict<MDXComponentMeta>;
  source: string;
}

export class Markdown extends React.Component<MarkdownProps> {
  constructor(props: MarkdownProps) {
    super(props);

    if (props.allowedComponents && props.inline) {
      throw new Error('Markdown Component: "inline" mode doesn\'t support "components"');
    }
  }

  render() {
    const { source, raw, allowedComponents, store, inline, dense } = this.props;

    if (allowedComponents && !store) {
      throw new Error('When using componentes in markdown, store prop must be provided');
    }

    const renderer = new MarkdownRenderer();
    if (allowedComponents) {
      return (
        <AdvancedMarkdown
          parts={renderer.renderMdWithComponents(source, allowedComponents, raw)}
          {...this.props}
        />
      );
    } else {
      return (
        <SanitizedMarkdownHTML
          html={renderer.renderMd(source, raw)}
          inline={inline}
          dense={dense}
        />
      );
    }
  }
}

export interface AdvancedMarkdownProps extends BaseMarkdownProps {
  parts: Array<string | MDXComponentMeta>;
}

export class AdvancedMarkdown extends React.Component<AdvancedMarkdownProps> {
  render() {
    const { raw, inline, dense, store, parts } = this.props;

    if (!parts.length) {
      return null;
    }

    return (
      <>
        {parts.map(
          (part, idx) =>
            typeof part === 'string' ? (
              <SanitizedMarkdownHTML html={part} inline={inline} dense={dense} key={idx} />
            ) : (
              <part.component key={idx} {...{ ...part.attrs, ...part.propsSelector(store) }} />
            ),
        )}
      </>
    );
  }
}
