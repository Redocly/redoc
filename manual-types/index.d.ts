declare module "dropkickjs"
declare module "json-schema-ref-parser"
declare module "openapi-sampler"
declare module "remarkable"
declare module "scrollparent"
declare module "slugify"
declare module "url"
declare module "json-pointer";
declare module "mark.js";

declare module "*.css" {
  const content: string;
  export default content;
}

declare var LIB_VERSION: any;
declare var IS_PRODUCTION: any;
declare var AOT: any;

interface ErrorStackTraceLimit {
  stackTraceLimit: number;
}
interface History {
  scrollRestoration: "auto"|"manual";
}
interface Window {
  HTMLElement: any
}
declare var safari: any;
interface ErrorConstructor extends ErrorStackTraceLimit {}
