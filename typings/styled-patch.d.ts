import * as styledComponents from 'styled-components';

// Styled components typings for using babel-plugin BEFORE typescript
declare module 'styled-components' {
  type Attrs<P, A extends Partial<P>, T> = {
    [K in keyof A]: ((props: ThemedStyledProps<P, T>) => A[K]) | A[K]
  };
  type KeyofBase = keyof any;
  type Diff<T extends KeyofBase, U extends KeyofBase> = ({ [P in T]: P } & { [P in U]: never })[T];
  type DiffBetween<T, U> = Pick<T, Diff<keyof T, keyof U>> & Pick<U, Diff<keyof U, keyof T>>;
  interface ThemedStyledFunction<P, T, O = P> {
    // adding "| string[]" for transpileTemplateLiterals and similar below
    (
      strings: TemplateStringsArray | string[],
      ...interpolations: Array<Interpolation<ThemedStyledProps<P, T>>>
    ): StyledComponentClass<P, T, O>;
    <U>(
      strings: TemplateStringsArray | string[],
      ...interpolations: Array<Interpolation<ThemedStyledProps<P & U, T>>>
    ): StyledComponentClass<P & U, T, O & U>;
    attrs<U, A extends Partial<P & U> = {}>(
      attrs: Attrs<P & U, A, T>,
    ): ThemedStyledFunction<DiffBetween<A, P & U>, T, DiffBetween<A, O & U>>;

    // adding "withConfig" for transpileTemplateLiterals
    withConfig(config: any): ThemedStyledFunction<P, T, O>;
  }

  export interface BaseThemedCssFunction<T> {
    (
      strings: TemplateStringsArray | string[],
      ...interpolations: SimpleInterpolation[]
    ): InterpolationValue[];
    <P>(
      strings: TemplateStringsArray | string[],
      ...interpolations: Array<Interpolation<ThemedStyledProps<P, T>>>
    ): Array<FlattenInterpolation<ThemedStyledProps<P, T>>>;
  }

  interface ThemedStyledComponentsModule<T> {
    keyframes(
      strings: TemplateStringsArray | string[],
      ...interpolations: SimpleInterpolation[]
  ): Keyframes;

  createGlobalStyle<P = {}>(
      strings: TemplateStringsArray | string[],
      ...interpolations: Array<Interpolation<ThemedStyledProps<P, T>>>
  ): GlobalStyleClass<P, T>;
  }
}
