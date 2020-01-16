import * as React from 'react';

import { ShelfIcon } from '../../common-elements';
import { Markdown } from '../Markdown/Markdown';

export interface CallbackTitleProps {
  name: string;
  description?: string;
  opened?: boolean;
  className?: string;
  onClick?: () => void;
}

export class CallbackTitle extends React.PureComponent<CallbackTitleProps> {
  render() {
    const { name, description, opened, className, onClick } = this.props;
    return (
      <div className={className} onClick={onClick || undefined}>
        <ShelfIcon size={'1.5em'} direction={opened ? 'down' : 'right'} float={'left'} />
        <strong>{name} </strong>
        {description && <Markdown compact={true} inline={true} source={description} />}
      </div>
    );
  }
}
