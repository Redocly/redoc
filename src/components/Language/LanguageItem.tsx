import type { ReactNode } from 'react';
import type { TabType } from '../../models/tab.js';
import type { Languages as LanguagesType } from '../../services/index.js';

import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';

import { CurlIcon } from '../../icons/CurlIcon/index.js';
import { CSharpIcon } from '../../icons/CSharpIcon/index.js';
import { NodeJSIcon } from '../../icons/NodeJSIcon/index.js';
import { JavaScriptIcon } from '../../icons/JavaScriptIcon/index.js';
import { PythonIcon } from '../../icons/PythonIcon/index.js';
import { RIcon } from '../../icons/RIcon/index.js';
import { RubyIcon } from '../../icons/RubyIcon/index.js';
import { PHPIcon } from '../../icons/PHPIcon/index.js';
import { GOIcon } from '../../icons/GOIcon/index.js';
import { JavaIcon } from '../../icons/JavaIcon/index.js';
import { PayloadIcon } from '../../icons/PayloadIcon/index.js';
import { LanguageIcon, LanguageTitle, LanguageTitleContainer } from './styled.js';

const iconMap: Record<LanguagesType | 'Payload', ReactNode> = {
  Payload: <PayloadIcon />,
  curl: <CurlIcon />,
  'C#': <CSharpIcon />,
  'C#+Newtonsoft': <CSharpIcon />,
  'Node.js': <NodeJSIcon />,
  JavaScript: <JavaScriptIcon />,
  Python: <PythonIcon />,
  R: <RIcon />,
  Ruby: <RubyIcon />,
  PHP: <PHPIcon />,
  Go: <GOIcon />,
  Java: <JavaIcon />,
  'Java8+Apache': <JavaIcon />,
};

interface LanguageItemProps {
  item: TabType & { lang: string };
  active?: boolean;
  withCheckmark?: boolean;
  withIcon?: boolean;
}

export const LanguageItem = ({ item, active, withCheckmark, withIcon }: LanguageItemProps) => {
  return (
    <>
      <LanguageTitleContainer>
        {withIcon && <LanguageIcon>{iconMap[item.lang]}</LanguageIcon>}
        <LanguageTitle active={active} title={item.title}>
          {item.title}
        </LanguageTitle>
      </LanguageTitleContainer>
      {withCheckmark && active && <CheckmarkIcon />}
    </>
  );
};
