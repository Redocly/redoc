import { palette } from '@leafygreen-ui/palette';
import { H1, MiddlePanel } from '../../common-elements';
import styled, { extensionsHook } from '../../styled-components';

const delimiterWidth = 15;

export const ApiInfoWrap = MiddlePanel;

export const ApiHeader = styled(H1)`
  margin-top: 0;
  margin-bottom: 0.5em;
  color: ${palette.green.dark2};
  font-family: 'MongoDB Value Serif';
  font-size: 32px;
  font-weight: 400;
  line-height: 40px;

  ${extensionsHook('ApiHeader')};
`;

export const ResourceVersionPill = styled.p`
  width: fit-content;
  padding: 1px 10px;
  background-color: ${palette.gray.light2};
  border-radius: 0.5rem;
`;

export const DownloadButton = styled.a`
  border: 1px solid ${props => props.theme.colors.primary.main};
  color: ${props => props.theme.colors.primary.main};
  font-weight: normal;
  margin-left: 0.5em;
  padding: 4px 8px 4px;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;

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
