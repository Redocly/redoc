import * as React from 'react';
import * as styledComponents from 'styled-components';
import { ResolvedThemeInterface } from './theme';
export { ResolvedThemeInterface };
export declare type InterpolationFunction<P> = styledComponents.InterpolationFunction<P>;
export declare type StyledFunction<T> = styledComponents.ThemedStyledFunction<T, ResolvedThemeInterface>;
declare function withProps<T, U extends HTMLElement = HTMLElement>(styledFunction: StyledFunction<React.HTMLProps<U>>): StyledFunction<T & React.HTMLProps<U>>;
declare const styled: styledComponents.ThemedBaseStyledInterface<ResolvedThemeInterface>, css: styledComponents.ThemedCssFunction<ResolvedThemeInterface>, injectGlobal: {
    (strings: TemplateStringsArray, ...interpolations: styledComponents.SimpleInterpolation[]): void;
    (strings: TemplateStringsArray | string[], ...interpolations: styledComponents.SimpleInterpolation[]): void;
}, keyframes: {
    (strings: TemplateStringsArray, ...interpolations: styledComponents.SimpleInterpolation[]): string;
    (strings: TemplateStringsArray | string[], ...interpolations: styledComponents.SimpleInterpolation[]): string;
}, ThemeProvider: React.ComponentClass<styledComponents.ThemeProviderProps<ResolvedThemeInterface>, any>;
export declare const media: {
    lessThan(breakpoint: any): (...args: any[]) => styledComponents.FlattenInterpolation<styledComponents.ThemeProps<ResolvedThemeInterface>>[];
    greaterThan(breakpoint: any): (...args: any[]) => styledComponents.FlattenInterpolation<styledComponents.ThemeProps<ResolvedThemeInterface>>[];
    between(firstBreakpoint: any, secondBreakpoint: any): (...args: any[]) => styledComponents.FlattenInterpolation<styledComponents.ThemeProps<ResolvedThemeInterface>>[];
};
export { css, injectGlobal, keyframes, ThemeProvider, withProps };
export default styled;
export declare function extensionsHook(styledName: string): (props: any) => any;
