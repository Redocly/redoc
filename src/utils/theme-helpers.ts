import { css } from 'styled-components';

import type { FlattenSimpleInterpolation } from 'styled-components';

const typographyProperties = Object.entries({
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  fontFamily: 'font-family',
  lineHeight: 'line-height',
  color: 'text-color',
  textTransform: 'text-transform',
});

export function getTypographyCssRulesByComponentName(
  componentName: string,
  fallbackName?: string,
): Record<string, string> {
  const result = {};
  for (const [styledPropertyName, cssPropertyName] of typographyProperties) {
    const cssVariable = `--${componentName}-${cssPropertyName}`;
    const fallbackVariable = fallbackName ? `,var(--${fallbackName}-${cssPropertyName})` : '';

    result[styledPropertyName] = `var(${cssVariable}${fallbackVariable})`;
  }
  return result;
}

export function typography(
  componentName: string,
  fallbackName?: string,
): FlattenSimpleInterpolation {
  return css`
    ${getTypographyCssRulesByComponentName(componentName, fallbackName)}
  `;
}
