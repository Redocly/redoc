import * as React from 'react';
import styled from '../../styled-components';

import { SampleControls } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';
import { jsonToHTML } from '../../utils/jsonToHtml';
import { jsonStyles } from './style';

interface JsonProps {
  data: any;
  className?: string;
}

const JsonViewerWrap = styled.div`
  &:hover > ${SampleControls} {
    opacity: 1;
  }
`;

class Json extends React.PureComponent<JsonProps> {
  node: HTMLDivElement;

  render() {
    return <CopyButtonWrapper data={this.props.data}>{this.renderInner}</CopyButtonWrapper>;
  }

  renderInner = ({ renderCopyButton }) => (
    <JsonViewerWrap>
      <SampleControls>
        {renderCopyButton()}
        <span onClick={this.expandAll}> Expand all </span>
        <span onClick={this.collapseAll}> Collapse all </span>
      </SampleControls>
      <div
        className={this.props.className}
        ref={node => (this.node = node!)}
        dangerouslySetInnerHTML={{ __html: jsonToHTML(this.props.data) }}
      />
    </JsonViewerWrap>
  );

  expandAll = () => {
    const elements = this.node.getElementsByClassName('collapsible');
    for (const collapsed of Array.prototype.slice.call(elements)) {
      (collapsed.parentNode as Element)!.classList.remove('collapsed');
    }
  };

  collapseAll = () => {
    const elements = this.node.getElementsByClassName('collapsible');
    for (const expanded of Array.prototype.slice.call(elements)) {
      // const collapsed = elements[i];
      if ((expanded.parentNode as Element)!.classList.contains('redoc-json')) {
        continue;
      }
      (expanded.parentNode as Element)!.classList.add('collapsed');
    }
  };

  clickListener = (event: MouseEvent) => {
    let collapsed;
    const target = event.target as HTMLElement;
    if (target.className === 'collapser') {
      collapsed = target.parentElement!.getElementsByClassName('collapsible')[0];
      if (collapsed.parentElement.classList.contains('collapsed')) {
        collapsed.parentElement.classList.remove('collapsed');
      } else {
        collapsed.parentElement.classList.add('collapsed');
      }
    }
  };

  componentDidMount() {
    this.node!.addEventListener('click', this.clickListener);
  }

  componentWillUnmount() {
    this.node!.removeEventListener('click', this.clickListener);
  }
}

export const JsonViewer = styled(Json)`
  ${jsonStyles};
`;
