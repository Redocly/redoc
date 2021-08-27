import { observer } from 'mobx-react';
import * as React from 'react';

import { Badge, DarkRightPanel, H2, MiddlePanel, Row } from '../../common-elements';
import { ShareLink } from '../../common-elements/linkify';
import { OperationModel, ReverseEventsRWOProps } from '../../services/models';
import styled from '../../styled-components';
import { CallbacksList } from '../Callbacks';
import { CallbackSamples } from '../CallbackSamples/CallbackSamples';
import { Endpoint } from '../Endpoint/Endpoint';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Extensions } from '../Fields/Extensions';
import { Markdown } from '../Markdown/Markdown';
import { OptionsContext } from '../OptionsProvider';
import { Parameters } from '../Parameters/Parameters';
import { RequestSamples } from '../RequestSamples/RequestSamples';
import { ResponsesList } from '../Responses/ResponsesList';
import { ResponseSamples } from '../ResponseSamples/ResponseSamples';
import { SecurityRequirements } from '../SecurityRequirement/SecurityRequirement';

const OperationRow = styled(Row)`
  backface-visibility: hidden;
  contain: content;
  overflow: hidden;
`;

const Description = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 6}px;
`;

export interface OperationProps {
  operation: OperationModel;
  reverseEventsReadWriteOnly?: ReverseEventsRWOProps;
}

@observer
export class Operation extends React.Component<OperationProps> {
  render() {
    const { operation } = this.props;
    const { name: summary, description, deprecated, externalDocs, isWebhook, reverseEventsReadWriteOnly = {} } = operation;
    const hasDescription = !!(description || externalDocs);

    return (
      <OptionsContext.Consumer>
        {(options) => (
          <OperationRow>
            <MiddlePanel>
              <H2>
                <ShareLink to={operation.id} />
                {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
                {isWebhook && <Badge type="primary"> Webhook </Badge>}
              </H2>
              {options.pathInMiddlePanel && !isWebhook && (
                <Endpoint operation={operation} inverted={true} />
              )}
              {hasDescription && (
                <Description>
                  {description !== undefined && <Markdown source={description} />}
                  {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
                </Description>
              )}
              <Extensions extensions={operation.extensions} />
              <SecurityRequirements securities={operation.security} />
              <Parameters
                parameters={operation.parameters}
                body={operation.requestBody}
                reverseEventsReadWriteOnly={reverseEventsReadWriteOnly}
              />
              <ResponsesList
                responses={operation.responses}
                reverseEventsReadWriteOnly={reverseEventsReadWriteOnly}
              />
              <CallbacksList
                callbacks={operation.callbacks}
                reverseEventsReadWriteOnly={reverseEventsReadWriteOnly}
              />
            </MiddlePanel>
            <DarkRightPanel>
              {!options.pathInMiddlePanel && !isWebhook && <Endpoint operation={operation} />}
              <RequestSamples operation={operation} />
              <ResponseSamples operation={operation} />
              <CallbackSamples callbacks={operation.callbacks} />
            </DarkRightPanel>
          </OperationRow>
        )}
      </OptionsContext.Consumer>
    );
  }
}
