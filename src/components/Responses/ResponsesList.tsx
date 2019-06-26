import * as React from 'react';
import { ResponseModel } from '../../services/models';
import { ResponseView } from './Response';

export interface ResponseListProps {
  responses: ResponseModel[];
}

export class ResponsesList extends React.PureComponent<ResponseListProps> {
  render() {
    const { responses } = this.props;

    if (!responses || responses.length === 0) {
      return null;
    }

    return (
      <div>
        {responses.map(response => {
          return <ResponseView key={response.code} response={response} />;
        })}
      </div>
    );
  }
}
