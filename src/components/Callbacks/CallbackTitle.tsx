import * as React from 'react';

import { ShelfIcon } from '../../common-elements';

export interface CallbackTitleProps {
  name: string;
  opened?: boolean;
  className?: string;
  onClick?: () => void;
}

export class CallbackTitle extends React.PureComponent<CallbackTitleProps> {
  render() {
    const { name, opened, className, onClick } = this.props;
    return (
      <div className={className} onClick={onClick || undefined}>
        <ShelfIcon size={'1.5em'} direction={opened ? 'up' : 'down'} float={'left'} />
        <strong>{name} </strong>
      </div>
    );
  }
}
