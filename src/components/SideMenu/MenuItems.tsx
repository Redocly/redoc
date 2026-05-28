import { observer } from 'mobx-react';
import * as React from 'react';

import type { IMenuItem } from '../../services';

import { getMenuItemsA11yProps } from './menuItemsA11y';
import { MenuItem } from './MenuItem';
import { MenuItemUl } from './styled.elements';

export interface MenuItemsProps {
  items: IMenuItem[];
  expanded?: boolean;
  onActivate?: (item: IMenuItem) => void;
  style?: React.CSSProperties;
  root?: boolean;

  className?: string;
}

interface MenuItemsState {
  animatedMaxHeight?: string;
}

@observer
export class MenuItems extends React.Component<MenuItemsProps, MenuItemsState> {
  private listRef = React.createRef<HTMLUListElement>();
  private animationFrameId?: number;

  constructor(props: MenuItemsProps) {
    super(props);
    const isRoot = !!props.root;
    const expanded = props.expanded == null ? true : props.expanded;

    this.state = {
      animatedMaxHeight: isRoot ? undefined : expanded ? 'none' : '0px',
    };
  }

  componentDidUpdate(prevProps: MenuItemsProps) {
    if (this.props.root) {
      return;
    }

    const expanded = this.props.expanded == null ? true : this.props.expanded;
    const prevExpanded = prevProps.expanded == null ? true : prevProps.expanded;

    if (expanded === prevExpanded) {
      return;
    }

    if (expanded) {
      this.expandWithAnimation();
      return;
    }

    this.collapseWithAnimation();
  }

  componentWillUnmount() {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private expandWithAnimation() {
    const list = this.listRef.current;
    if (!list) {
      return;
    }

    const expandedHeight = `${list.scrollHeight}px`;
    this.setState({ animatedMaxHeight: expandedHeight });
  }

  private collapseWithAnimation() {
    const list = this.listRef.current;
    if (!list) {
      return;
    }

    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const expandedHeight = `${list.scrollHeight}px`;
    this.setState({ animatedMaxHeight: expandedHeight }, () => {
      this.animationFrameId = requestAnimationFrame(() => {
        this.setState({ animatedMaxHeight: '0px' });
      });
    });
  }

  private onTransitionEnd = (event: React.TransitionEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'max-height') {
      return;
    }

    const expanded = this.props.expanded == null ? true : this.props.expanded;
    if (expanded && this.state.animatedMaxHeight !== 'none') {
      this.setState({ animatedMaxHeight: 'none' });
    }
  };

  render() {
    const { items, root, className } = this.props;
    const expanded = this.props.expanded == null ? true : this.props.expanded;
    const isRoot = !!root;
    const style = isRoot
      ? this.props.style
      : { ...this.props.style, maxHeight: this.state.animatedMaxHeight };

    return (
      <MenuItemUl
        ref={this.listRef}
        className={className}
        style={style}
        $expanded={expanded}
        $root={isRoot}
        onTransitionEnd={isRoot ? undefined : this.onTransitionEnd}
        {...getMenuItemsA11yProps(isRoot, expanded)}
      >
        {items.map((item, idx) => (
          <MenuItem key={idx} item={item} onActivate={this.props.onActivate} />
        ))}
      </MenuItemUl>
    );
  }
}
