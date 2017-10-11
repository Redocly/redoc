import * as React from 'react';

import { ClipboardService } from '../../services';

export class SelectOnClick extends React.PureComponent {
  handleClick = () => {
    ClipboardService.selectElement(this.refs.child);
  };

  render() {
    const { children } = this.props;
    return (
      <div ref="child" onClick={this.handleClick}>
        {children}
      </div>
    );
  }
}
