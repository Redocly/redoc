import styled from '../styled-components';

export const Button = styled.button`
  display: inline-block;
  vertical-align: middle;
  border: 0;
  padding: 0;
  margin: 4px;
  position: relative;
  width: 24px;
  height: 24px;
  background-color: #ebebeb;
  cursor: pointer;
  transition: background .15s,opacity .15s,border-color .15s;
  white-space: nowrap;
  border-radius: 16px;

  &:hover {
      background-color: #ccc;
      text-decoration: none;
  }

  &:focus {
    outline: none;
  }

  @media screen and (max-width: 450px) {
    display: none;
  }
`;
