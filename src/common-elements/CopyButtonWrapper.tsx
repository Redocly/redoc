import * as React from 'react';
import { Tooltip } from 'react-tippy';
import { injectGlobal } from '../styled-components';

import styles from 'react-tippy/dist/tippy.css';

injectGlobal`${styles}`;

import { ClipboardService } from '../services/ClipboardService';

export interface CopyButtonWrapperProps {
  data: any;
  children: (
    props: {
      renderCopyButton: (() => React.ReactNode);
    },
  ) => React.ReactNode;
}

export class CopyButtonWrapper extends React.PureComponent<
  CopyButtonWrapperProps,
  { tooltipShown: boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      tooltipShown: false,
    };
  }

  render() {
    return this.props.children({ renderCopyButton: this.renderCopyButton });
  }

  copy = () => {
    const content =
      typeof this.props.data === 'string'
        ? this.props.data
        : JSON.stringify(this.props.data, null, 2);
    ClipboardService.copyCustom(content);
    this.showTooltip();
  };

  renderCopyButton = () => {
    return (
      <span onClick={this.copy}>
        <Tooltip
          // options
          title={ClipboardService.isSupported() ? 'Copied' : 'Not supported in your browser'}
          position="top"
          open={this.state.tooltipShown}
          arrow="true"
          duration={150}
          trigger="manual"
          theme="light"
        >
          Copy
        </Tooltip>
      </span>
    );
  };

  showTooltip() {
    this.setState({
      tooltipShown: true,
    });

    setTimeout(() => {
      this.setState({
        tooltipShown: false,
      });
    }, 1500);
  }
}
