import styled, { extensionsHook } from '../styled-components';

export const PrismDiv = styled.div`
  /**
  * Based on prism-dark.css
  */

  code[class*='language-'],
  pre[class*='language-'] {
    /* color: white;
    background: none; */
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  @media print {
    code[class*='language-'],
    pre[class*='language-'] {
      text-shadow: none;
    }
  }

  /* Code blocks */
  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #bbb;
  }

  .token.punctuation {
    opacity: 0.7;
  }

  .namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.number,
  .token.constant,
  .token.symbol {
    color: #4a8bb3;
  }

  .token.boolean {
    color: firebrick;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.punctuation,
  .token.inserted {
    color: #333333;
    & + a,
    & + a:visited {
      color: #4ed2ba;
      text-decoration: underline;
    }
  }

  /* .property.token.string {
    color: white;
  } */

  .token.operator,
  .token.entity,
  .token.url,
  .token.variable {
    color: #ee8208;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #aa64cc;
  }

  .token.regex,
  .token.important {
    color: #e90;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.deleted {
    color: red;
  }

  ${extensionsHook('Prism')};
`;
