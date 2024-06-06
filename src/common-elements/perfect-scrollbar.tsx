import * as React from 'react';

import PerfectScrollbarType, * as PerfectScrollbarNamespace from 'perfect-scrollbar';

import { OptionsContext } from '../components/OptionsProvider';
import styled, { createGlobalStyle } from '../styled-components';
import { IS_BROWSER } from '../utils';

/*
 * perfect scrollbar umd bundle uses exports assignment while module uses default export
 * so when bundled with webpack default export works but with jest it crashes
 * That's why the following ugly fix is required
 */
const PerfectScrollbarConstructor =
  PerfectScrollbarNamespace.default || (PerfectScrollbarNamespace as any as PerfectScrollbarType);

let psStyles = '';
if (IS_BROWSER) {
  psStyles = require('perfect-scrollbar/css/perfect-scrollbar.css');
  psStyles = (typeof psStyles.toString === 'function' && psStyles.toString()) || '';
  psStyles = psStyles === '[object Object]' ? '' : psStyles;
}

const PSStyling = createGlobalStyle`${psStyles}`;

const StyledScrollWrapper = styled.div`
  position: relative;
`;

export interface PerfectScrollbarProps {
  options?: PerfectScrollbarType.Options;
  className?: string;
  updateFn?: (fn) => void;
}

export class PerfectScrollbar extends React.Component<
  React.PropsWithChildren<PerfectScrollbarProps>
> {
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
        {psStyles && <PSStyling />}
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
