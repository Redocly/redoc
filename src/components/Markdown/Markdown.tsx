import * as React from 'react';
import styled from '../../styled-components';

import { MarkdownRenderer } from '../../services';
import { ComponentWithOptions } from '../OptionsProvider';
import * as DOMPurify from 'dompurify';

import { markdownCss } from './styles';

interface MarkdownProps {
  source: string;
  dense?: boolean;
  inline?: boolean;
  className?: string;
  raw?: boolean;
  components?: { [name: string]: React.ComponentClass };
  sanitize?: boolean;
}

class InternalMarkdown extends ComponentWithOptions<MarkdownProps> {
  constructor(props: MarkdownProps) {
    super(props);

    if (props.components && props.inline) {
      throw new Error(`Markdown Component: "inline" mode doesn't support "components"`);
    }
  }

  render() {
    let sanitize: (string) => string;

    if (this.props.sanitize || this.options.untrustedSpec) {
      sanitize = html => DOMPurify.sanitize(html);
    } else {
      sanitize = html => html;
    }

    const renderer = new MarkdownRenderer();
    const { source, raw, className, components, inline, dense } = this.props;
    const parts = components
      ? renderer.renderMdWithComponents(source, components, raw)
      : [renderer.renderMd(source, raw)];

    if (!parts.length) return null;

    let appendClass = ' redoc-markdown';
    if (dense) appendClass += ' -dense';
    if (inline) appendClass += ' -inline';

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
              <part.component key={idx} {...part.attrs} />
            ),
        )}
      </div>
    );
  }
}

export const Markdown = styled(InternalMarkdown)`
  ${markdownCss};
`;
