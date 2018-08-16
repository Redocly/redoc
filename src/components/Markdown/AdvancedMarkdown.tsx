import * as React from 'react';

import { AppStore, MarkdownRenderer, MDXComponentMeta } from '../../services';
import { BaseMarkdownProps } from './Markdown';
import { SanitizedMarkdownHTML } from './SanitizedMdBlock';

import { StoreConsumer } from '../StoreBuilder';

export interface AdvancedMarkdownProps extends BaseMarkdownProps {
  allowedComponents: Dict<MDXComponentMeta>;
  htmlWrap?: (part: JSX.Element) => JSX.Element;
}

export class AdvancedMarkdown extends React.Component<AdvancedMarkdownProps> {
  render() {
    return <StoreConsumer>{store => this.renderWithStore(store)}</StoreConsumer>;
  }

  renderWithStore(store?: AppStore) {
    const { allowedComponents, source, htmlWrap = i => i } = this.props;
    if (!store) {
      throw new Error('When using componentes in markdown, store prop must be provided');
    }

    const renderer = new MarkdownRenderer();
    const parts = renderer.renderMdWithComponents(source, allowedComponents);

    if (!parts.length) {
      return null;
    }

    return parts.map((part, idx) => {
      if (typeof part === 'string') {
        return React.cloneElement(
          htmlWrap(<SanitizedMarkdownHTML html={part} inline={false} dense={false} />),
          { key: idx },
        );
      }
      return <part.component key={idx} {...{ ...part.attrs, ...part.propsSelector(store) }} />;
    });
  }
}
