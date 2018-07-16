import * as React from 'react';

import styled from '../styled-components';

export const SampleControls = styled.div`
  opacity: 0.4;
  transition: opacity 0.3s ease;
  text-align: right;

  > span {
    display: inline-block;
    padding: 2px 10px;
    cursor: pointer;

    :hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const SampleControlsWrap = styled.div`
  &:hover ${SampleControls} {
    opacity: 1;
  }
`;
