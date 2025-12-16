import type { Languages as LanguagesType } from './types.js';

export const Languages: Record<string, LanguagesType | 'Payload'> = {
  curl: 'curl',
  JavaScript: 'JavaScript',
  NodeJs: 'Node.js',
  Python: 'Python',
  Java: 'Java',
  // Java8: 'Java8+Apache',
  CSharp: 'C#',
  // CSharpNewtonsoft: 'C#+Newtonsoft',
  PHP: 'PHP',
  Go: 'Go',
  Ruby: 'Ruby',
  R: 'R',
  Payload: 'Payload',
};
