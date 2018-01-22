import * as React from 'react';

import { ClipboardService } from '../../services';

export class SelectOnClick extends React.PureComponent {
  private child: HTMLDivElement | null;
  handleClick = () => {
    ClipboardService.selectElement(this.refs.child);
  };

  render() {
    const { children } = this.props;
    return (
      <div ref={el => (this.child = el)} onClick={this.handleClick}>
        {children}
      </div>
    );
  }
}
