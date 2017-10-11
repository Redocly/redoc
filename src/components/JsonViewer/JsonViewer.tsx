import * as React from 'react';
import styled from '../../styled-components';

import { jsonToHTML } from '../../utils/jsonToHtml';
import { jsonStyles } from './style';

interface JsonProps {
  data: any;
  className?: string;
}

class Json extends React.PureComponent<JsonProps> {
  node: HTMLElement | null;

  render() {
    return (
      <div
        className={this.props.className}
        ref={node => (this.node = node)}
        dangerouslySetInnerHTML={{ __html: jsonToHTML(this.props.data) }}
      />
    );
  }

  clickListener = (event: MouseEvent) => {
    var collapsed,
      target = event.target as HTMLElement;
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

export const StyledJson = styled(Json)`
  ${jsonStyles};
`;
