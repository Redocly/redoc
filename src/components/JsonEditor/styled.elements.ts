import styled from '../../styled-components';

export const JeFt = styled.div`
  background-color: rgba(38, 50, 56, 0.4);
  border-color: rgba(38, 50, 56, 0.5);
  color: #999;
  margin-top: -2px;
  width: 100%;
  height: 28px;
  cursor: pointer !important;
`;

export const JeFtResize = styled.div`
  position: relative;
  line-height: normal;
  user-select: none;

  > span {
    position: absolute;
    right: 3px;
    top: 7px;
  }
`;
