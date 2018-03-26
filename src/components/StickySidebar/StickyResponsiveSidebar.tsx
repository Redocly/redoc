import { observer } from 'mobx-react';
import * as React from 'react';

import { MenuStore } from '../../services/MenuStore';
import { RedocNormalizedOptions, RedocRawOptions } from '../../services/RedocNormalizedOptions';
import styled, { media, withProps } from '../../styled-components';
import { IS_BROWSER } from '../../utils/index';
import { OptionsContext } from '../OptionsProvider';
import { AnimatedChevronButton } from './ChevronSvg';

let Stickyfill;
if (IS_BROWSER) {
  Stickyfill = require('stickyfill').default;
}

export interface StickySidebarProps {
  className?: string;
  scrollYOffset?: RedocRawOptions['scrollYOffset']; // passed directly or via context
  menu: MenuStore;
}

const stickyfill = Stickyfill && Stickyfill();

const StyledStickySidebar = withProps<{ open?: boolean }>(styled.div)`
  width: ${props => props.theme.menu.width};
  background-color: ${props => props.theme.menu.backgroundColor};
  overflow: hidden;
  display: flex;
  flex-direction: column;

  backface-visibility: hidden;
  contain: strict;

  height: 100vh;
  position: sticky;
  position: -webkit-sticky;
  top: 0;

  ${media.lessThan('small')`
    position: fixed;
    z-index: 20;
    width: 100%;
    background: #ffffff;
    display: ${props => (props.open ? 'flex' : 'none')};
  `};
`;

const FloatingButton = styled.div`
  outline: none;
  user-select: none;
  background-color: #f2f2f2;
  color: ${props => props.theme.colors.main};
  display: none;
  cursor: pointer;
  position: fixed;
  right: 20px;
  z-index: 100;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  ${media.lessThan('small')`
    display: flex;
  `};
  bottom: 44px;

  width: 60px;
  height: 60px;
  padding: 0 20px;
`;

@observer
export class StickyResponsiveSidebar extends React.Component<StickySidebarProps> {
  stickyElement: Element;

  componentDidMount() {
    if (stickyfill) {
      stickyfill.add(this.stickyElement);
    }
  }

  componentWillUnmount() {
    if (stickyfill) {
      stickyfill.remove(this.stickyElement);
    }
  }

  getScrollYOffset(options) {
    let top;
    if (this.props.scrollYOffset !== undefined) {
      top = RedocNormalizedOptions.normalizeScrollYOffset(this.props.scrollYOffset)();
    } else {
      top = options.scrollYOffset();
    }
    return top + 'px';
  }

  render() {
    const open = this.props.menu.sideBarOpened;

    const style = options => {
      const top = this.getScrollYOffset(options);
      return {
        top,
        height: `calc(100vh - ${top})`,
      };
    };

    return (
      <OptionsContext.Consumer>
        {options => (
          <>
            <StyledStickySidebar
              open={open}
              className={this.props.className}
              style={style(options)}
              // tslint:disable-next-line
              innerRef={el => {
                this.stickyElement = el;
              }}
            >
              {this.props.children}
            </StyledStickySidebar>
            <FloatingButton onClick={this.toggleNavMenu}>
              <AnimatedChevronButton open={open} />
            </FloatingButton>
          </>
        )}
      </OptionsContext.Consumer>
    );
  }

  private toggleNavMenu = () => {
    this.props.menu.toggleSidebar();
  };

  // private closeNavMenu = () => {
  //   this.setState({ open: false });
  // };
}
