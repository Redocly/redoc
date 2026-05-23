import * as React from 'react';

import { Code, ResponseTitleWrap } from './styled.elements';
import { ShelfIcon } from '../../common-elements';
import { Markdown } from '../Markdown/Markdown';

export interface ResponseTitleProps {
  code: string;
  title: string;
  type: string;
  empty?: boolean;
  opened?: boolean;
  className?: string;
  onClick?: () => void;
}

function ResponseTitleComponent({
  title,
  empty,
  code,
  opened,
  className,
  onClick,
}: ResponseTitleProps): React.ReactElement {
  return (
    <button
      className={className}
      onClick={(!empty && onClick) || undefined}
      aria-expanded={opened}
      disabled={empty}
    >
      <ResponseTitleWrap>
        <Code>{code} </Code>
        <Markdown compact={true} inline={true} source={title} />
      </ResponseTitleWrap>
      {!empty && (
        <ShelfIcon
          size={'1.3em'}
          color={'rgb(102, 102, 102)'}
          direction={opened ? 'down' : 'right'}
          float={'left'}
        />
      )}
    </button>
  );
}

export const ResponseTitle = React.memo<ResponseTitleProps>(ResponseTitleComponent);
