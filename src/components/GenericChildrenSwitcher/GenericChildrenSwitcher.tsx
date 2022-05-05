import { observer } from 'mobx-react';
import * as React from 'react';

import { DropdownProps, DropdownOption } from '../../common-elements/Dropdown';
import { DropdownLabel, DropdownWrapper } from '../PayloadSamples/styled.elements';

export interface GenericChildrenSwitcherProps<T> {
  items?: T[];
  options: DropdownOption[];
  label?: string;
  renderDropdown: (props: DropdownProps) => JSX.Element;
  children: (activeItem: T) => JSX.Element;
}

export interface GenericChildrenSwitcherState {
  activeItemIdx: number;
}
/**
 * TODO: Refactor this component:
 * Implement rendering dropdown/label directly in this component
 * Accept as a parameter mapper-function for building dropdown option labels
 */
@observer
export class GenericChildrenSwitcher<T> extends React.Component<
  GenericChildrenSwitcherProps<T>,
  GenericChildrenSwitcherState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeItemIdx: 0,
    };
  }

  switchItem = ({ idx }: DropdownOption) => {
    if (this.props.items && idx !== undefined) {
      this.setState({
        activeItemIdx: idx,
      });
    }
  };

  render() {
    const { items } = this.props;

    if (!items || !items.length) {
      return null;
    }

    const Wrapper = ({ children }) =>
      this.props.label ? (
        <DropdownWrapper>
          <DropdownLabel>{this.props.label}</DropdownLabel>
          {children}
        </DropdownWrapper>
      ) : (
        children
      );

    return (
      <>
        <Wrapper>
          {this.props.renderDropdown({
            value: this.props.options[this.state.activeItemIdx].value,
            options: this.props.options,
            onChange: this.switchItem,
            ariaLabel: this.props.label || 'Callback',
          })}
        </Wrapper>

        {this.props.children(items[this.state.activeItemIdx])}
      </>
    );
  }
}
