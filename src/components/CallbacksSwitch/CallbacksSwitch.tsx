import { observer } from 'mobx-react';
import * as React from 'react';

import { DropdownProps } from '../../common-elements/dropdown';
import { DropdownLabel, DropdownWrapper } from '../PayloadSamples/styled.elements';
import { OperationModel } from '../../services/models';

export interface CallbacksSwitchProps {
  callbacks?: OperationModel[];
  withLabel?: boolean;

  renderDropdown: (props: DropdownProps) => JSX.Element;
  children: (activeCallback: OperationModel) => JSX.Element;
}

export interface CallbacksSwitchState {
  activeItemIdx: number;
}

@observer
export class CallbacksSwitch extends React.Component<CallbacksSwitchProps, CallbacksSwitchState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItemIdx: 0,
    };
  }

  switchCallback = ({ value }) => {
    if (this.props.callbacks) {
      this.setState({
        activeItemIdx: parseInt(value, 10),
      });
    }
  };

  render() {
    const { callbacks } = this.props;

    if (!callbacks || !callbacks.length) {
      return null;
    }

    const options = callbacks.map((callback, idx) => {
      return {
        label: `[${callback.httpVerb.toUpperCase()}] ${callback.name}`,
        value: idx.toString(),
      };
    });

    const Wrapper = ({ children }) =>
      this.props.withLabel ? (
        <DropdownWrapper>
          <DropdownLabel>Callback</DropdownLabel>
          {children}
        </DropdownWrapper>
      ) : (
        children
      );

    return (
      <>
        <Wrapper>
          {this.props.renderDropdown({
            value: options[this.state.activeItemIdx],
            options,
            onChange: this.switchCallback,
          })}
        </Wrapper>

        {this.props.children(callbacks[this.state.activeItemIdx])}
      </>
    );
  }
}
