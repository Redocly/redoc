export interface JsonProps {
    data: any;
    className?: string;
}
export declare const JsonViewer: import("styled-components").StyledComponentClass<JsonProps, import("../../theme").ResolvedThemeInterface, Pick<JsonProps, "data" | "className"> & {
    theme?: import("../../theme").ResolvedThemeInterface | undefined;
}>;
