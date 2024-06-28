import * as React from 'react';

import styled from '../styled-components';

const Wrapper = styled.div`
  position: relative;
`;

const Tip = styled.div`
  position: absolute;
  min-width: 80px;
  max-width: 500px;
  background: #fff;
  bottom: 100%;
  left: 50%;
  margin-bottom: 10px;
  transform: translateX(-50%);

  border-radius: 4px;
  padding: 0.3em 0.6em;
  text-align: center;
  box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);
`;

const Content = styled.div`
  background: #fff;
  color: #000;
  display: inline;
  font-size: 0.85em;
  white-space: nowrap;
`;

const Arrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  border-left: solid transparent 5px;
  border-right: solid transparent 5px;
  border-top: solid #fff 5px;
`;

const Gap = styled.div`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: -20px;
`;

export interface TooltipProps extends React.PropsWithChildren<any> {
  open: boolean;
  title: string;
}

export class Tooltip extends React.Component<TooltipProps> {
  render() {
    const { open, title, children } = this.props;
    return (
      <Wrapper>
        {children}
        {open && (
          <Tip>
            <Content>{title}</Content>
            <Arrow />
            <Gap />
          </Tip>
        )}
      </Wrapper>
    );
  }
}
