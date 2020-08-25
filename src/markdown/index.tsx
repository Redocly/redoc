const TocPlugin = require('./plugins/export-toc');

type Header = {
  depth: number;
  id: number;
  text: string;
};
export type MarkdownDocument = {
  component: (props: any) => JSX.Element;
  headings: Header[];
};

export type MarkdownIndex = {
  components: ((props: any) => JSX.Element)[];
  headings: Header[];
};

export const loadMarkdownIndexFromComponents = (mdxComponents) => {
  const components = mdxComponents.map((sect) => sect.default);
  const headings = mdxComponents.reduce((acc, section) => [...acc, ...section.headings], []);

  return {
    components,
    headings,
  };
};

export default {
  remarkPlugins: [TocPlugin],
};
