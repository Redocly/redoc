import * as React from 'react';
import { HFlex } from '../common-elements/flex';
import styled from 'styled-components';

const Button = styled.button`
  margin-left: auto;
`;

const TryOutWidget: React.FC = () => {
  const onClick = (e) => {
    e.preventDefault();
    window.location.href = 'https://en.wikipedia.org/wiki/Register';
  };
  return (
    <HFlex>
      <Button onClick={onClick}>TRY OUT</Button>
    </HFlex>
  );
};

export default TryOutWidget;
