import { loadMarkdownIndexFromComponents } from '../../../src/markdown';

export const loadMarkdownIndex = (names) => {
  const mdxComponents = names.map((include) => require(`./${include}.mdx`));

  return loadMarkdownIndexFromComponents(mdxComponents)
};

const NAMES = [
  'welcome',
  'auth',
]


export default loadMarkdownIndex(NAMES)
