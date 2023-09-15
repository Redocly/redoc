/**
 * Could not find ready-to-use component with required behaviour so
 * I quickly hacked my own. Will refactor into separate npm package later
 */

import * as React from 'react';
import styled from '../src/styled-components';

const DropDownItem = styled.li<{ $active?: boolean }>`
  ${(props: any) => (props.$active ? 'background-color: #eee' : '')};
  padding: 13px 16px;
  &:hover {
    background-color: #eee;
  }
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DropDownList = styled.ul`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 0 0 2px 2px;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 200;
  overflow: hidden;
  position: absolute;
  list-style: none;
  margin: 4px 0 0 0;
  padding: 5px 0;
  font-family: Roboto, sans-serif;
  overflow: hidden;
`;

const ComboBoxWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;

  font-size: 16px;
  height: 28px;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 1;
  outline: none;

  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;

  &:focus {
    border-color: #66afe9;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
  }
`;

const Button = styled.button`
  background-color: #fff;
  color: #333;
  padding: 2px 10px;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  border: 1px solid #ccc;
  border-left: 0;
  font-size: 16px;
  height: 28px;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 1;
  outline: none;
  width: 80px;

  white-space: nowrap;

  @media screen and (max-width: 450px) {
    display: none;
  }
`;

export interface ComboBoxProps {
  onChange?: (val: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
}
export interface ComboBoxState {
  open: boolean;
  value: string;
  activeItemIdx: number;
}

export default class ComboBox extends React.Component<ComboBoxProps, ComboBoxState> {
  state = {
    open: false,
    value: this.props.value || '',
    activeItemIdx: -1,
  };

  open = () => {
    this.setState({
      open: true,
    });
  };

  close = () => {
    this.setState({
      open: false,
      activeItemIdx: -1,
    });
  };

  handleChange = e => {
    this.updateValue(e.currentTarget.value);
  };

  updateValue(value) {
    this.setState({
      value,
      activeItemIdx: -1,
    });
  }

  handleSelect(value: string) {
    this.updateValue(value);
    if (this.props.onChange) {
      this.props.onChange(value);
    }
    this.close();
  }

  handleTryItClick = () => {
    this.handleSelect(this.state.value);
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.handleSelect(e.currentTarget.value);
    } else if (e.keyCode === 40) {
      const activeItemIdx = Math.min(this.props.options.length - 1, ++this.state.activeItemIdx);
      this.setState({
        open: true,
        activeItemIdx,
        value: this.props.options[activeItemIdx].value,
      });
      e.preventDefault();
    } else if (e.keyCode === 38) {
      const activeItemIdx = Math.max(0, --this.state.activeItemIdx);
      this.setState({
        activeItemIdx,
        value: this.props.options[activeItemIdx].value,
      });
      e.preventDefault();
    } else if (e.keyCode === 27) {
      this.close();
    }
  };

  handleBlur = () => {
    setTimeout(() => this.close(), 100);
  };

  handleItemClick = (val, idx) => {
    this.handleSelect(val);
    this.setState({
      activeItemIdx: idx,
    });
  };

  renderOption = (option: { value: string; label: string }, idx: number) => {
    return (
      <DropDownItem
        $active={idx === this.state.activeItemIdx}
        key={option.value}
        // tslint:disable-next-line
        onMouseDown={() => {
          this.handleItemClick(option.value, idx);
        }}
      >
        <small>
          <strong>{option.label}</strong>
        </small>
        <br />
        {option.value}
      </DropDownItem>
    );
  };

  render() {
    const { open, value } = this.state;
    const { options, placeholder } = this.props;
    return (
      <ComboBoxWrap>
        <Input
          placeholder={placeholder}
          onChange={this.handleChange}
          value={value}
          onFocus={this.open}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyPress}
          aria-label="URL to an OpenAPI definition to try"
        />
        <Button onClick={this.handleTryItClick}> TRY IT </Button>
        {open && <DropDownList>{options.map(this.renderOption)}</DropDownList>}
      </ComboBoxWrap>
    );
  }
}
