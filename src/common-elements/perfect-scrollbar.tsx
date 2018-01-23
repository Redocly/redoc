import * as React from 'react';

import { default as PerfectScrollbarConstructor } from 'perfect-scrollbar';
import psStyles from 'perfect-scrollbar/css/perfect-scrollbar.css';
import styled, { injectGlobal } from '../styled-components';

injectGlobal`${psStyles.toString()}`;

const StyledScrollWrapper = styled.div`
  position: relative;
`;

export class PerfectScrollbar extends React.Component<{
  options?: PerfectScrollbarConstructor.Options;
  className?: string;
  updateFn: (fn) => void;
}> {
  private _container: HTMLElement;
  private inst: PerfectScrollbarConstructor;

  componentDidMount() {
    this.inst = new PerfectScrollbarConstructor(this._container, this.props.options || {});
  }

  componentDidUpdate() {
    this.inst.update();
  }

  componentWillUnmount() {
    this.inst.destroy();
  }

  handleRef = ref => {
    this._container = ref;
  };

  render() {
    const { children, className, updateFn } = this.props;

    updateFn(this.componentDidUpdate.bind(this));

    return (
      <StyledScrollWrapper className={`scrollbar-container ${className}`} innerRef={this.handleRef}>
        {children}
      </StyledScrollWrapper>
    );
  }
}
