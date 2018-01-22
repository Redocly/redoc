import * as React from 'react';
import { RedocNormalizedOptions, RedocRawOptions } from '../../services/RedocNormalizedOptions';
import styled from '../../styled-components';
import { ComponentWithOptions } from '../OptionsProvider';

let Stickyfill;
if (typeof window !== 'undefined') {
  Stickyfill = require('stickyfill').default;
}

export interface StickySidebarProps {
  className?: string;
  scrollYOffset?: RedocRawOptions['scrollYOffset']; // passed directly or via context
}

const stickyfill = Stickyfill && Stickyfill();

const StyledStickySidebar = styled.div`
  width: ${props => props.theme.menu.width};
  background-color: ${props => props.theme.menu.backgroundColor};
  overflow: hidden;
  display: flex;
  flex-direction: column;

  transform: translateZ(0);

  height: 100vh;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
`;

export class StickySidebar extends ComponentWithOptions<StickySidebarProps> {
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

  get scrollYOffset() {
    let top;
    if (this.props.scrollYOffset !== undefined) {
      top = RedocNormalizedOptions.normalizeScrollYOffset(this.props.scrollYOffset)();
    } else {
      top = this.options.scrollYOffset();
    }
    return top + 'px';
  }

  render() {
    const top = this.scrollYOffset;

    const height = `calc(100vh - ${top})`;

    return (
      <StyledStickySidebar
        className={this.props.className}
        style={{ top, height }}
        // tslint:disable-next-line
        innerRef={el => {
          this.stickyElement = el;
        }}
      >
        {this.props.children}
      </StyledStickySidebar>
    );
  }
}
