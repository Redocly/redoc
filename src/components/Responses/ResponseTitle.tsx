import * as React from 'react';

import { Code, ResponseButton } from './styled.elements';
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
  type,
  empty,
  code,
  opened,
  className,
  onClick,
}: ResponseTitleProps): React.ReactElement {
  return (
    <ResponseButton
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
      <Markdown compact={true} inline={true} source={title} />
    </ResponseButton>
  );
}

export const ResponseTitle = React.memo<ResponseTitleProps>(ResponseTitleComponent);
