import * as React from 'react';
import * as ReactTooltip from 'react-tooltip';

import { ClipboardService } from '../services/ClipboardService';

export interface CopyButtonWrapperProps {
  data: any;
  children: (
    props: {
      renderCopyButton: (() => React.ReactNode);
    },
  ) => React.ReactNode;
}

export class CopyButtonWrapper extends React.PureComponent<CopyButtonWrapperProps> {
  render() {
    return this.props.children({ renderCopyButton: this.renderCopyButton });
  }

  copy = () => {
    const content =
      typeof this.props.data === 'string'
        ? this.props.data
        : JSON.stringify(this.props.data, null, 2);
    ClipboardService.copyCustom(content);
  };

  renderCopyButton = () => {
    return (
      <>
        <span
          onClick={this.copy}
          data-tip={true}
          data-for="copy_tooltip"
          data-event="click"
          data-event-off="mouseleave"
        >
          Copy
        </span>
        <ReactTooltip
          isCapture={true}
          id="copy_tooltip"
          place="top"
          getContent={this.getTooltipContent}
          type="light"
          effect="solid"
        />
      </>
    );
  };

  getTooltipContent() {
    return ClipboardService.isSupported() ? 'Copied' : 'Not supported in your browser';
  }
}
