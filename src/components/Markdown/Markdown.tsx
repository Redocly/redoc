import * as React from 'react';
import styled from '../../styled-components';

import * as DOMPurify from 'dompurify';
import { AppStore, MarkdownRenderer } from '../../services';
import { ComponentWithOptions } from '../OptionsProvider';

import { markdownCss } from './styles';

export interface MDComponent {
  component: React.ComponentClass;
  propsSelector: (store?: AppStore) => any;
  attrs?: object;
}

export interface MarkdownProps {
  source: string;
  dense?: boolean;
  inline?: boolean;
  className?: string;
  raw?: boolean;
  components?: Dict<MDComponent>;
  sanitize?: boolean;
  store?: AppStore;
}

class InternalMarkdown extends ComponentWithOptions<MarkdownProps> {
  constructor(props: MarkdownProps) {
    super(props);

    if (props.components && props.inline) {
      throw new Error('Markdown Component: "inline" mode doesn\'t support "components"');
    }
  }

  render() {
    const { source, raw, className, components, inline, dense, store } = this.props;

    if (components && !store) {
      throw new Error('When using components with Markdwon in ReDoc, store prop must be provided');
    }

    const sanitize =
      this.props.sanitize || this.options.untrustedSpec
        ? (html: string) => DOMPurify.sanitize(html)
        : (html: string) => html;

    const renderer = new MarkdownRenderer();
    const parts = components
      ? renderer.renderMdWithComponents(source, components, raw)
      : [renderer.renderMd(source, raw)];

    if (!parts.length) {
      return null;
    }

    let appendClass = ' redoc-markdown';
    if (dense) {
      appendClass += ' -dense';
    }
    if (inline) {
      appendClass += ' -inline';
    }

    if (inline) {
      return (
        <span
          className={className + appendClass}
          dangerouslySetInnerHTML={{ __html: sanitize(parts[0] as string) }}
        />
      );
    }

    return (
      <div className={className + appendClass}>
        {parts.map(
          (part, idx) =>
            typeof part === 'string' ? (
              <div key={idx} dangerouslySetInnerHTML={{ __html: sanitize(part) }} />
            ) : (
              <part.component key={idx} {...{ ...part.attrs, ...part.propsSelector(store) }} />
            ),
        )}
      </div>
    );
  }
}

export const Markdown = styled(InternalMarkdown)`
  ${markdownCss};
`;
