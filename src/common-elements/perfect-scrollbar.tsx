import * as React from 'react';

import PerfectScrollbarType, * as PerfectScrollbarNamespace from 'perfect-scrollbar';
import psStyles from 'perfect-scrollbar/css/perfect-scrollbar.css';
import styled, { injectGlobal } from '../styled-components';

/*
 * perfect scrollbar umd bundle uses exports assignment while module uses default export
 * so when bundled with webpack default export works but with jest it crashes
 * That's why the following ugly fix is required
 */
const PerfectScrollbarConstructor =
  PerfectScrollbarNamespace.default || ((PerfectScrollbarNamespace as any) as PerfectScrollbarType);

injectGlobal`${psStyles && psStyles.toString()}`;

const StyledScrollWrapper = styled.div`
  position: relative;
`;

export class PerfectScrollbar extends React.Component<{
  options?: PerfectScrollbarType.Options;
  className?: string;
  updateFn: (fn) => void;
}> {
  private _container: HTMLElement;
  private inst: PerfectScrollbarType;

  componentDidMount() {
    const offset = (this._container.parentElement && this._container.parentElement.scrollTop) || 0;
    this.inst = new PerfectScrollbarConstructor(this._container, this.props.options || {});
    this._container.scrollTo(0, offset);
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
