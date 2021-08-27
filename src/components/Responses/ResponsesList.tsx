import * as React from 'react';
import { l } from '../../services/Labels';
import { ResponseModel } from '../../services/models';
import styled from '../../styled-components';
import { ResponseView } from './Response';

const ResponsesHeader = styled.h3`
  font-size: 1.3em;
  padding: 0.2em 0;
  margin: 3em 0 1.1em;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: normal;
`;

export interface ResponseListProps {
  responses: ResponseModel[];
  isCallback?: boolean;
}

export class ResponsesList extends React.PureComponent<ResponseListProps> {
  render() {
    const { responses, isCallback } = this.props;

    if (!responses || responses.length === 0) {
      return null;
    }

    return (
      <div>
        <ResponsesHeader>{isCallback ? l('callbackResponses') : l('responses')}</ResponsesHeader>
        {responses.map(response => {
          return <ResponseView key={response.code} response={response} />;
        })}
      </div>
    );
  }
}
