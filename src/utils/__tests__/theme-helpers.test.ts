import { getTypographyCssRulesByComponentName } from '../theme-helpers';

describe('getTypographyCssRulesByComponentName', () => {
  it('should return object with defined css variable for component', () => {
    expect(getTypographyCssRulesByComponentName('component')).toEqual({
      fontSize: 'var(--component-font-size)',
      fontWeight: 'var(--component-font-weight)',
      fontFamily: 'var(--component-font-family)',
      lineHeight: 'var(--component-line-height)',
      color: 'var(--component-text-color)',
      textTransform: 'var(--component-text-transform)',
    });
  });

  it('should return object with fallback', () => {
    expect(getTypographyCssRulesByComponentName('component', 'component1')).toEqual({
      fontSize: 'var(--component-font-size,var(--component1-font-size))',
      fontWeight: 'var(--component-font-weight,var(--component1-font-weight))',
      fontFamily: 'var(--component-font-family,var(--component1-font-family))',
      lineHeight: 'var(--component-line-height,var(--component1-line-height))',
      color: 'var(--component-text-color,var(--component1-text-color))',
      textTransform: 'var(--component-text-transform,var(--component1-text-transform))',
    });
  });
});
