import * as styledComponents from 'styled-components';

// FIXME
declare module 'styled-components' {
  export interface ThemedStyledFunction<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > extends ThemedStyledFunctionBase<C, T, O, A> {
    withConfig(config: any): any;
    // tslint:enable:unified-signatures
  }

  interface ThemedStyledComponentsModule<T> {
    keyframes(
      strings: TemplateStringsArray | string[],
      ...interpolations: SimpleInterpolation[]
    ): Keyframes;
  }
}
