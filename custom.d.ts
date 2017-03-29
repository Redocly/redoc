declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.json" {
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
