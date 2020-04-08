import { observer } from 'mobx-react';
import * as React from 'react';

import { OperationModel } from '../../services/models';
import styled from '../../styled-components';
import { Endpoint } from '../Endpoint/Endpoint';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Extensions } from '../Fields/Extensions';
import { Markdown } from '../Markdown/Markdown';
import { Parameters } from '../Parameters/Parameters';
import { ResponsesList } from '../Responses/ResponsesList';
import { SecurityRequirements } from '../SecurityRequirement/SecurityRequirement';
import { CallbackDetailsWrap } from './styled.elements';

export interface CallbackDetailsProps {
  operation: OperationModel;
}

@observer
export class CallbackDetails extends React.Component<CallbackDetailsProps> {
  render() {
    const { operation } = this.props;
    const { description, externalDocs } = operation;
    const hasDescription = !!(description || externalDocs);

    return (
      <CallbackDetailsWrap>
        {hasDescription && (
          <Description>
            {description !== undefined && <Markdown source={description} />}
            {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
          </Description>
        )}
        <Endpoint operation={this.props.operation} inverted={true} compact={true} />
        <Extensions extensions={operation.extensions} />
        <SecurityRequirements securities={operation.security} />
        <Parameters parameters={operation.parameters} body={operation.requestBody} />
        <ResponsesList responses={operation.responses} isCallback={operation.isCallback} />
      </CallbackDetailsWrap>
    );
  }
}

const Description = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 3}px;
`;
