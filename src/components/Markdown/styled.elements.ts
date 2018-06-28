import * as React from 'react';
import { InterpolationFunction, Styles, ThemeProps } from 'styled-components';

import { headerCommonMixin, linkifyMixin } from '../../common-elements';
import styled, {
  css,
  ResolvedThemeInterface,
  StyledComponentClass,
  withProps,
} from '../../styled-components';

export const StyledMarkdownBlock = withProps<{ dense?: boolean; inline?: boolean }>(styled.div)`

  font-family: ${props => props.theme.baseFont.family};
  font-weight: ${props => props.theme.baseFont.weight};
  line-height: ${props => props.theme.baseFont.lineHeight};

  p {
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  ${({ dense }) =>
    dense &&
    ` p {
    margin: 0;
  }`}

  ${({ inline }) =>
    inline &&
    ` p {
    display: inline-block;
  }`}

  h1 {
    ${headerCommonMixin(1)};
    color: ${props => props.theme.colors.main};
    margin-top: 0;
  }

  h2 {
    ${headerCommonMixin(2)};
    color: ${props => props.theme.colors.text};
  }

  code {
    color: ${({ theme }) => theme.colors.code};
    background-color: ${({ theme }) => theme.colors.codeBg};
    font-family: ${props => props.theme.code.fontFamily};
    border-radius: 2px;
    border: 1px solid rgba(38, 50, 56, 0.1);
    padding: 0.1em 0.25em 0.2em;
    font-size: ${props => props.theme.code.fontSize};
  }

  pre {
    font-family: ${props => props.theme.code.fontFamily};
    white-space: pre-wrap;
    background-color: #263238;
    color: white;
    padding: 12px 14px 15px 14px;
    overflow-x: auto;
    line-height: normal;
    border-radius: 0px
    border: 1px solid rgba(38, 50, 56, 0.1);

    code {
      background-color: transparent;
      color: white;

      &:before,
      &:after {
        content: none;
      }
    }
  }

  blockquote {
    margin: 0;
    margin-bottom: 1em;
    padding: 0 15px;
    color: #777;
    border-left: 4px solid #ddd;
  }

  img {
    max-width: 100%;
    box-sizing: content-box;
  }

  ul,
  ol {
    padding-left: 2em;
    margin: 0;
    margin-bottom: 1em;
    > li {
      margin: 1em 0;
    }
  }

  table {
    display: block;
    width: 100%;
    overflow: auto;
    word-break: normal;
    word-break: keep-all;
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  table tr {
    background-color: #fff;
    border-top: 1px solid #ccc;

    &:nth-child(2n) {
      background-color: #f8f8f8;
    }
  }

  table th,
  table td {
    padding: 6px 13px;
    border: 1px solid #ddd;
  }

  table th {
    text-align: left;
    font-weight: bold;
  }

  ${linkifyMixin('.share-link')};
`;
