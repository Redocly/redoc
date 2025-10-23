// Source: https://github.com/github/linguist/blob/master/lib/linguist/popular.yml
// Filtered by supported targets here: https://github.com/Kong/httpsnippet/tree/master/src/targets
// Plus Node.js and cUrl
export type Languages =
  | 'JavaScript'
  | 'Node.js'
  | 'curl'
  | 'Java8+Apache'
  | 'Java'
  | 'Python'
  | 'Go'
  | 'PHP'
  | 'C#'
  | 'C#+Newtonsoft'
  | 'Ruby'
  | 'R';

export interface CodeSamplesConfig {
  languages: { lang: 'Payload' | string; label?: string }[];
}
