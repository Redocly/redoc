import * as React from 'react';
import styled from '../src/styled-components';

const Button = styled.button`
  background-color: #fff;
  color: #333;
  padding: 2px 10px;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  border: none;
  font-size: 16px;
  height: 28px;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 1;
  outline: none;
  white-space: nowrap;
`;

export interface ClipboardImporterProps {
  onPaste?: (val: any) => void;
}

export default class ClipboardImporter extends React.Component<any, any> {
  render() {
    if (!('clipboard' in navigator)) {
      return null;
    }
    return <Button title='Get spec from clipboard' onClick={() => this.import()}>📋</Button>;
  }

  private import() {
    navigator.clipboard.readText()
      .then(text => {
        if (!text) {
          return;
        }
        const asJson = JSON.parse(text);
        if (asJson) {
          this.props.onPaste(asJson);
        }
      })
      .catch(() => {
        console.error('Failed to get spec from clipboard')
      })
  }
}
