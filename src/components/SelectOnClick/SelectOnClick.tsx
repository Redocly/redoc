import * as React from 'react';

import { ClipboardService } from '../../services';

export class SelectOnClick extends React.PureComponent<React.PropsWithChildren<any>> {
  private child: HTMLDivElement | null;
  selectElement = () => {
    ClipboardService.selectElement(this.child);
  };

  render() {
    const { children } = this.props;
    return (
      <div
        ref={el => (this.child = el)}
        onClick={this.selectElement}
        onFocus={this.selectElement}
        tabIndex={0}
        role="button"
      >
        {children}
      </div>
    );
  }
}
