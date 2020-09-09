import * as React from 'react';

import PerfectScrollbarType, * as PerfectScrollbarNamespace from 'perfect-scrollbar';
import psStyles from 'perfect-scrollbar/css/perfect-scrollbar.css';

import { OptionsContext } from '../components/OptionsProvider';
import styled, { createGlobalStyle } from '../styled-components';

/*
 * perfect scrollbar umd bundle uses exports assignment while module uses default export
 * so when bundled with webpack default export works but with jest it crashes
 * That's why the following ugly fix is required
 */
const PerfectScrollbarConstructor =
  PerfectScrollbarNamespace.default || ((PerfectScrollbarNamespace as any) as PerfectScrollbarType);

const PSStyling = createGlobalStyle`${psStyles && psStyles.toString()}`;

const StyledScrollWrapper = styled.div`
  position: relative;
`;

export interface PerfectScrollbarProps {
  options?: PerfectScrollbarType.Options;
  className?: string;
  updateFn?: (fn) => void;
}

export class PerfectScrollbar extends React.Component<PerfectScrollbarProps> {
  private _container: HTMLElement;
  private inst: PerfectScrollbarType;

  componentDidMount() {
    const offset = (this._container.parentElement && this._container.parentElement.scrollTop) || 0;
    this.inst = new PerfectScrollbarConstructor(this._container, this.props.options || {});
    if (this._container.scrollTo) {
      this._container.scrollTo(0, offset);
    }
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

    if (updateFn) {
      updateFn(this.componentDidUpdate.bind(this));
    }

    return (
      <>
        <PSStyling />
        <StyledScrollWrapper className={`scrollbar-container ${className}`} ref={this.handleRef}>
          {children}
        </StyledScrollWrapper>
      </>
    );
  }
}

export function PerfectScrollbarWrap(
  props: PerfectScrollbarProps & { children: JSX.Element[] | JSX.Element },
) {
  return (
    <OptionsContext.Consumer>
      {options =>
        !options.nativeScrollbars ? (
          <PerfectScrollbar {...props}>{props.children}</PerfectScrollbar>
        ) : (
          <div
            style={{
              overflow: 'auto',
              overscrollBehavior: 'contain',
              msOverflowStyle: '-ms-autohiding-scrollbar',
            }}
          >
            {props.children}
          </div>
        )
      }
    </OptionsContext.Consumer>
  );
}
