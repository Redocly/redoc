import * as React from 'react';

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

export class ResponseTitle extends React.PureComponent<ResponseTitleProps> {
  render() {
    const { title, empty, code, className, onClick } = this.props;
    return (
      <div className={className} onClick={(!empty && onClick) || undefined}>
        <strong>{code} </strong>
        <Markdown compact={true} inline={true} source={title} />
      </div>
    );
  }
}
