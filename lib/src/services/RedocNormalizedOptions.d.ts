import { ResolvedThemeInterface, ThemeInterface } from '../theme';
import { MDXComponentMeta } from './MarkdownRenderer';
export interface RedocRawOptions {
    theme?: ThemeInterface;
    scrollYOffset?: number | string | (() => number);
    hideHostname?: boolean | string;
    expandResponses?: string | 'all';
    requiredPropsFirst?: boolean | string;
    noAutoAuth?: boolean | string;
    nativeScrollbars?: boolean | string;
    pathInMiddlePanel?: boolean | string;
    untrustedSpec?: boolean | string;
    hideLoading?: boolean | string;
    hideDownloadButton?: boolean | string;
    disableSearch?: boolean | string;
    unstable_ignoreMimeParameters?: boolean;
    allowedMdComponents?: Dict<MDXComponentMeta>;
}
export declare class RedocNormalizedOptions {
    static normalizeExpandResponses(value: RedocRawOptions['expandResponses']): {};
    static normalizeHideHostname(value: RedocRawOptions['hideHostname']): boolean;
    static normalizeScrollYOffset(value: RedocRawOptions['scrollYOffset']): () => number;
    theme: ResolvedThemeInterface;
    scrollYOffset: () => number;
    hideHostname: boolean;
    expandResponses: {
        [code: string]: boolean;
    } | 'all';
    requiredPropsFirst: boolean;
    noAutoAuth: boolean;
    nativeScrollbars: boolean;
    pathInMiddlePanel: boolean;
    untrustedSpec: boolean;
    hideDownloadButton: boolean;
    disableSearch: boolean;
    unstable_ignoreMimeParameters: boolean;
    allowedMdComponents: Dict<MDXComponentMeta>;
    constructor(raw: RedocRawOptions, defaults?: RedocRawOptions);
}
