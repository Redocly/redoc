import type { ReactNode } from 'react';
import type { TabType } from '../../../jotai/app.js';

import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';

import { CurlIcon } from '../../../icons/CurlIcon/CurlIcon.js';
import { CSharpIcon } from '../../../icons/CSharpIcon/CSharpIcon.js';
import { NodeJSIcon } from '../../../icons/NodeJSIcon/NodeJSIcon.js';
import { JavaScriptIcon } from '../../../icons/JavaScriptIcon/JavaScriptIcon.js';
import { PythonIcon } from '../../../icons/PythonIcon/PythonIcon.js';
import { RIcon } from '../../../icons/RIcon/RIcon.js';
import { RubyIcon } from '../../../icons/RubyIcon/RubyIcon.js';
import { PHPIcon } from '../../../icons/PHPIcon/PHPIcon.js';
import { GOIcon } from '../../../icons/GOIcon/GOIcon.js';
import { JavaIcon } from '../../../icons/JavaIcon/JavaIcon.js';
import { PayloadIcon } from '../../../icons/PayloadIcon/PayloadIcon.js';
import { getGeneratorKey } from '../../../utils/languages.js';
import { LanguageIcon, LanguageTitle, LanguageTitleContainer } from './styled.js';

const iconMap: Record<string, ReactNode> = {
  payload: <PayloadIcon />,
  json: <PayloadIcon />,
  curl: <CurlIcon />,
  bash: <CurlIcon />,
  csharp: <CSharpIcon />,
  csharpnewtonsoft: <CSharpIcon />,
  node: <NodeJSIcon />,
  javascript: <JavaScriptIcon />,
  python: <PythonIcon />,
  r: <RIcon />,
  ruby: <RubyIcon />,
  php: <PHPIcon />,
  go: <GOIcon />,
  java: <JavaIcon />,
  java8: <JavaIcon />,
};

type LanguageItemProps = {
  item: TabType & { lang: string };
  active?: boolean;
  withCheckmark?: boolean;
  withIcon?: boolean;
};

export const LanguageItem = ({ item, active, withCheckmark, withIcon }: LanguageItemProps) => {
  // Resolve from the language, never from `key` — a custom `label` overwrites `key` with the
  // label, and never from the grammar, which cannot tell `Node.js` from `JavaScript`.
  const icon = iconMap[getGeneratorKey(item)];
  return (
    <>
      <LanguageTitleContainer>
        {withIcon && <LanguageIcon>{icon}</LanguageIcon>}
        <LanguageTitle $active={active} title={item.title}>
          {item.title}
        </LanguageTitle>
      </LanguageTitleContainer>
      {withCheckmark && active && <CheckmarkIcon />}
    </>
  );
};
