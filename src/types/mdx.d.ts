declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export const headings: any;
  export default MDXComponent;
}
