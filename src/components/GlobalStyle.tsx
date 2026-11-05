// Redoc CE runs inside host pages. The theme's global styles target `<html>`, `body` and bare
// elements, so they would restyle the host page. This version keeps only the theme variables on
// `:root`, scopes element styles to `.redoc` roots, and restores browser defaults that host CSS
// resets remove.

import { createGlobalStyle, StyleSheetManager } from 'styled-components';

import type { ReactElement } from 'react';

import { darkMode, tokens } from '@redocly/theme/core/styles';
import { DEFAULT_COLOR_MODES } from '@redocly/theme/core/constants';

import { REDOC_ROOT_CLASS } from '../jotai/color-mode.js';

type StylisElement = {
  type: string;
  props: string | string[];
  value: string;
  children: string | StylisElement[];
};

const ROOT = `.${REDOC_ROOT_CLASS}`;
const DARK_ROOT = `${ROOT}.${DEFAULT_COLOR_MODES.DARK}`;
const BODY_MENU = `body > :has(> [data-component-name='Dropdown/DropdownMenu'])`;
const LIGHT_TOKENS = ':where(:root)';
const DARK_TOKENS = `:where(:root:has(${DARK_ROOT}))`;

const DESCENDANT_SCOPES: [string, string][] = [
  [`${LIGHT_TOKENS} `, `:is(${ROOT}, :where(${BODY_MENU})) `],
  [`${DARK_TOKENS} `, `:is(${DARK_ROOT}, :where(:root:has(${DARK_ROOT}) ${BODY_MENU})) `],
];

function scopeSelector(selector: string): string {
  const scope = DESCENDANT_SCOPES.find(([prefix]) => selector.startsWith(prefix));
  return scope ? scope[1] + selector.slice(scope[0].length) : selector;
}

function scopeTokenRules(element: StylisElement): void {
  if (element.type === 'rule' && Array.isArray(element.props)) {
    if (
      Array.isArray(element.children) &&
      element.props.every((selector) => selector === LIGHT_TOKENS || selector === DARK_TOKENS)
    ) {
      element.children = element.children.filter(
        (child) => child.type !== 'decl' || String(child.props).startsWith('--'),
      );
    }
    element.props = element.props.map(scopeSelector);
  }
}

const STYLIS_PLUGINS = [scopeTokenRules];

const ScopedStyle = createGlobalStyle`
  ${LIGHT_TOKENS} {
    ${tokens}
  }

  ${DARK_TOKENS} {
    ${darkMode}
  }

  ${ROOT} {
    background-color: var(--bg-color);
    color: var(--text-color-primary);
    font-family: var(--font-family-base);
  }

  :where(${BODY_MENU}) {
    color: var(--text-color-primary);
    font-family: var(--font-family-base);
  }

  ${DARK_ROOT}, :where(:root:has(${DARK_ROOT}) ${BODY_MENU}) {
    color-scheme: dark;
  }

  :where(${ROOT}) svg[display='none'] {
    display: none;
  }

  :where(${ROOT}, ${BODY_MENU}) button {
    font-family: var(--font-family-base);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-base);
    background-color: inherit;
    cursor: pointer;
    border: none;
    color: var(--text-color-primary);
  }

  :where(${ROOT}) :is(p, ul, ol, dl, dd, blockquote, figure, pre, hr, h1, h2, h3, h4, h5, h6, table) {
    margin: revert;
  }

  :where(${ROOT}) :is(ul, ol, menu, dd) {
    padding: revert;
    list-style: revert;
  }

  :where(${ROOT}) :is(h1, h2, h3, h4, h5, h6) {
    font-size: revert;
    font-weight: revert;
    line-height: revert;
  }

  :where(${ROOT}) a {
    color: revert;
    text-decoration: revert;
  }

  :where(${ROOT}) :is(code, kbd, samp, pre) {
    font-family: revert;
    font-size: revert;
    color: revert;
  }

  :where(${ROOT}) :is(img, svg, video, canvas, iframe) {
    display: revert;
    vertical-align: revert;
  }

  :where(${ROOT}) table {
    border-collapse: revert;
  }
`;

export function GlobalStyle(): ReactElement {
  return (
    <StyleSheetManager stylisPlugins={STYLIS_PLUGINS}>
      <ScopedStyle />
    </StyleSheetManager>
  );
}
