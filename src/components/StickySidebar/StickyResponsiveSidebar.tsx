import { observer } from 'mobx-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { MenuStore } from '../../services/MenuStore';
import { RedocNormalizedOptions, RedocRawOptions } from '../../services/RedocNormalizedOptions';
import styled, { media } from '../../styled-components';
import { IS_BROWSER } from '../../utils/index';
import { OptionsContext } from '../OptionsProvider';
import { AnimatedChevronButton } from './ChevronSvg';

let Stickyfill;
if (IS_BROWSER) {
  Stickyfill = require('stickyfill');
}

export interface StickySidebarProps {
  className?: string;
  scrollYOffset?: RedocRawOptions['scrollYOffset']; // passed directly or via context
  menu: MenuStore;
}

const stickyfill = Stickyfill && Stickyfill();

const StyledStickySidebar = styled.div<{ open?: boolean }>`
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

  @media print {
    display: none;
  }
`;

const FloatingButton = styled.div`
  outline: none;
  user-select: none;
  background-color: #f2f2f2;
  color: ${props => props.theme.colors.primary.main};
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
  box-sizing: content-box;

  height: 60px;
  width: 20px;
  padding: 0 20px;

  @media print {
    display: none;
  }
`;


export interface FloatingButtonProps {
  onClick?: () => void;
  parentElement: Element;
}

@observer
class PortaledFloatingButton extends React.Component<FloatingButtonProps> {
  portalRoot: HTMLElement;
  floatingButtonRef: HTMLElement;

  constructor(props) {
    super(props);
    this.portalRoot = document.createElement('div');
    this.portalRoot.classList.add('portalled-element');
  }



  private setFloatingButtonRef = (node) => {
    this.floatingButtonRef = node;
  }

  componentWillUnmount() {
    document.body.removeChild(this.portalRoot);
  }

  componentDidMount() {
    const { parentElement } = this.props;

    document.body.appendChild(this.portalRoot);
    this.floatingButtonRef.style.top = `${parentElement.getBoundingClientRect().bottom - 88}px`;
    this.floatingButtonRef.style.left = `${parentElement.getBoundingClientRect().right - 88}px`;
  }

  render() {
    return createPortal(
      <FloatingButton ref={this.setFloatingButtonRef} {...this.props} />,
      this.portalRoot,
    );
  }
}

@observer
class PortaledStickySidebar extends React.Component<FloatingButtonProps> {
  portalRoot: HTMLElement;
  stickySidebarRef: HTMLElement;

  constructor(props) {
    super(props);
    this.portalRoot = document.createElement('div');
    this.portalRoot.classList.add('portalled-element');
  }

  componentWillUnmount() {
    document.body.removeChild(this.portalRoot);
  }

  private setStickySidebarRef = (node) => {
    this.stickySidebarRef = node;
  }

  componentDidMount() {
    const { parentElement } = this.props;

    document.body.appendChild(this.portalRoot);
    this.stickySidebarRef.style.top = `${parentElement.getBoundingClientRect().top}px`;
    this.stickySidebarRef.style.left = `${parentElement.getBoundingClientRect().left}px`;
    this.stickySidebarRef.style.width = `${parentElement.clientWidth}px`;
    this.stickySidebarRef.style.zIndex = '99';
  }

  render() {
    return createPortal(
      <StyledStickySidebar ref={this.setStickySidebarRef} {...this.props} />,
      this.portalRoot,
    );
  }
}

@observer
export class StickyResponsiveSidebar extends React.Component<StickySidebarProps> {
  stickyElement: Element;
  portalRoot: Element;

  constructor(props) {
    super(props);
    this.portalRoot = document.createElement('div');
    this.portalRoot.classList.add('portalled-element');

  }

  componentDidMount() {
    document.body.appendChild(this.portalRoot);

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

  getSidebarStyles = options => {
    if (options.parentElement instanceof Element) {
      return {
        height: options.parentElement.offsetHeight,
      };
    } else {
      const top = this.getScrollYOffset(options);
      return {
        top,
        height: `calc(100vh - ${top})`,
      };
    }
  }

  setStickyElementRef = el => {
    this.stickyElement = el as any;
  }

  render() {
    const open = this.props.menu.sideBarOpened;

    return (
      <OptionsContext.Consumer>
        {options => {
          const CondFloating = options.parentElement ? PortaledFloatingButton :
            FloatingButton;
          const CondSidebar = options.parentElement && window.innerWidth < 800 ? PortaledStickySidebar :
            StyledStickySidebar;

          return (
            <>
              <CondSidebar
                open={open}
                className={this.props.className}
                style={this.getSidebarStyles(options)}
                ref={this.setStickyElementRef}
                parentElement={options.parentElement}
              >
                {this.props.children}
              </CondSidebar>
              <CondFloating onClick={this.toggleNavMenu} parentElement={options.parentElement}>
                <AnimatedChevronButton open={open} />
              </CondFloating>
            </>
          )
        }}
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
