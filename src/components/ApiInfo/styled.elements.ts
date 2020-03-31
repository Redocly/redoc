import { H1, MiddlePanel } from '../../common-elements';
import styled, { extensionsHook } from '../../styled-components';

const delimiterWidth = 15;

export const ApiInfoWrap = MiddlePanel;

export const ApiHeader = styled(H1)`
  margin-top: 0;
  margin-bottom: 0.5em;
  display: flex;

  ${extensionsHook('ApiHeader')};
`;

export const AdditionalDocLink = styled.a`
  text-decoration:none
  font-size: 16px;
  color: #0084CE;
  &:hover {
    color: #00639B;
  }
`;

export const DownloadButton = styled.a`
  border-radius: 16px;
  color: #FFFFFF;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  margin-left: 0.5em;
  padding: 6px 24px;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  background: #0084CE;
  &:hover {
    background: #339DD8;;
  }
  &:active {
    background: #00639B;;
  }

  ${extensionsHook('DownloadButton')};
`;

export const InfoSpan = styled.span`
  &::before {
    content: '|';
    display: inline-block;
    opacity: 0.5;
    width: ${delimiterWidth}px;
    text-align: center;
  }

  &:last-child::after {
    display: none;
  }
`;

export const InfoSpanBoxWrap = styled.div`
  overflow: hidden;
`;

export const InfoSpanBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  // hide separator on new lines: idea from https://stackoverflow.com/a/31732902/1749888
  margin-left: -${delimiterWidth}px;
`;
