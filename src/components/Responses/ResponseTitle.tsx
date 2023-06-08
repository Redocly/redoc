import * as React from 'react';

import { Code } from './styled.elements';
import { ShelfIcon } from '../../common-elements';
import { Markdown } from '../Markdown/Markdown';

export interface ResponseTitleProps {
  code: string;
  title: string;
  type: string;
  descriptionClass?: string;
  empty?: boolean;
  opened?: boolean;
  className?: string;
  onClick?: () => void;
}

function ResponseTitleComponent({
  title,
  type,
  empty,
  code,
  descriptionClass,
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
      {!empty && (
        <ShelfIcon
          size={'1.5em'}
          color={type}
          direction={opened ? 'down' : 'right'}
          float={'left'}
        />
      )}
      <Code>{code} </Code>
      <div className={descriptionClass + ' ResponseTitleComponent__Markdown'}>
        <Markdown compact={true} inline={true} source={title} />
      </div>
    </button>
  );
}

export const ResponseTitle = React.memo<ResponseTitleProps>(ResponseTitleComponent);
