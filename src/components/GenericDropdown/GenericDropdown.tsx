import { observer } from 'mobx-react';
import * as React from 'react';

import { DropdownProps, DropdownOption } from '../../common-elements/dropdown';
import { DropdownLabel, DropdownWrapper } from '../PayloadSamples/styled.elements';

export interface GenericDropdownProps<T> {
  items?: T[];
  options: DropdownOption[];
  label?: string;
  renderDropdown: (props: DropdownProps) => JSX.Element;
  children: (activeItem: T) => JSX.Element;
}

export interface GenericDropdownState {
  activeItemIdx: number;
}

@observer
export class GenericDropdown<T> extends React.Component<
  GenericDropdownProps<T>,
  GenericDropdownState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeItemIdx: 0,
    };
  }

  switchItem = ({ value }) => {
    if (this.props.items) {
      this.setState({
        activeItemIdx: parseInt(value, 10),
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
            value: this.props.options[this.state.activeItemIdx],
            options: this.props.options,
            onChange: this.switchItem,
          })}
        </Wrapper>

        {this.props.children(items[this.state.activeItemIdx])}
      </>
    );
  }
}
