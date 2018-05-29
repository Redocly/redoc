import * as styledComponents from 'styled-components';

// Styled components typings for using babel-plugin BEFORE typescript
declare module 'styled-components' {
  interface ThemedStyledFunction<P, T, O = P> {
    // adding "| string[]" for transpileTemplateLiterals and similar below
    (
      strings: TemplateStringsArray | string[],
      ...interpolations: Interpolation<ThemedStyledProps<P, T>>[]
    ): StyledComponentClass<P, T, O>;

    new <U>(
      strings: TemplateStringsArray | string[],
      ...interpolations: Interpolation<ThemedStyledProps<P & U, T>>[]
    ): StyledComponentClass<P & U, T, O & U>;

    // adding "withConfig" for transpileTemplateLiterals
    withConfig(config: any): ThemedStyledFunction<P, T, O>;
  }

  export interface ThemedCssFunction<T> {
    // adding "| string[]" for transpileTemplateLiterals and similar below
    (
      strings: TemplateStringsArray | string[],
      ...interpolations: SimpleInterpolation[]
    ): InterpolationValue[];
    <P>(
      strings: TemplateStringsArray | string[],
      ...interpolations: Interpolation<ThemedStyledProps<P, T>>[]
    ): FlattenInterpolation<ThemedStyledProps<P, T>>[];
  }

  interface ThemedStyledComponentsModule<T> {
    keyframes(
      strings: TemplateStringsArray | string[],
      ...interpolations: SimpleInterpolation[]
    ): string;
    injectGlobal(
      strings: TemplateStringsArray | string[],
      ...interpolations: SimpleInterpolation[]
    ): void;
  }
}
