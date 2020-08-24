import { AppStore } from './AppStore';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';
export declare const LEGACY_REGEXP = "^\\s*<!-- ReDoc-Inject:\\s+?<{component}\\s*?/?>\\s+?-->\\s*$";
export declare const MDX_COMPONENT_REGEXP = "^\\s*<{component}\\s*?/>\\s*$";
export declare const COMPONENT_REGEXP: string;
export interface MDXComponentMeta {
    component: React.ComponentType;
    propsSelector: (store?: AppStore) => any;
    attrs?: object;
}
export interface MarkdownHeading {
    id: string;
    name: string;
    level: number;
    items?: MarkdownHeading[];
    description?: string;
}
export declare function buildComponentComment(name: string): string;
export declare class MarkdownRenderer {
    options?: RedocNormalizedOptions | undefined;
    static containsComponent(rawText: string, componentName: string): boolean;
    headings: MarkdownHeading[];
    currentTopHeading: MarkdownHeading;
    private headingEnhanceRenderer;
    private originalHeadingRule;
    constructor(options?: RedocNormalizedOptions | undefined);
    saveHeading(name: string, level: number, container?: MarkdownHeading[], parentId?: string): MarkdownHeading;
    flattenHeadings(container?: MarkdownHeading[]): MarkdownHeading[];
    attachHeadingsDescriptions(rawText: string): void;
    headingRule: (text: string, level: number, raw: string) => string;
    renderMd(rawText: string, extractHeadings?: boolean): string;
    extractHeadings(rawText: string): MarkdownHeading[];
    renderMdWithComponents(rawText: string): Array<string | MDXComponentMeta>;
}
