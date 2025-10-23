import { styled } from '../../../styled-components.js';
import { ClearButton as ClearButtonComponent } from './ClearButton.js';

export const ClearButton = styled(ClearButtonComponent)`
  z-index: 1;
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #89949f;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;
