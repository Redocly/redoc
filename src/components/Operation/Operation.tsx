import * as React from 'react';
import { SecurityRequirements } from '../SecurityRequirement/SecurityRequirement';

import { observer } from 'mobx-react';

import { Badge, ConsoleButton, DarkRightPanel, FlexLayoutReverse, H2, MiddlePanel, Row } from '../../common-elements';

import { OptionsContext } from '../OptionsProvider';

import { ShareLink } from '../../common-elements/linkify';
import { ConsoleViewer } from '../Console/ConsoleViewer';
import { Endpoint } from '../Endpoint/Endpoint';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Markdown } from '../Markdown/Markdown';
import { Parameters } from '../Parameters/Parameters';
import { RequestSamples } from '../RequestSamples/RequestSamples';
import { ResponsesList } from '../Responses/ResponsesList';
import { ResponseSamples } from '../ResponseSamples/ResponseSamples';

import { OperationModel as OperationType } from '../../services/models';
import styled from '../../styled-components';
import { Extensions } from '../Fields/Extensions';

const OperationRow = styled(Row)`
  backface-visibility: hidden;
  contain: content;

  overflow: hidden;
`;

const Description = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 6}px;
`;

export interface OperationProps {
  operation: OperationType;
}

export interface OperationState {
  executeMode: boolean;
}

@observer
export class Operation extends React.Component<OperationProps, OperationState> {

  constructor(props) {
    super(props);
    this.state = {
      executeMode: false,
    };
  }

  onConsoleClick = () => {
    this.setState({
      executeMode: !this.state.executeMode,
    });
  }

  render() {
    const { operation } = this.props;
    const { executeMode } = this.state;

    const { name: summary, description, deprecated, externalDocs } = operation;
    const hasDescription = !!(description || externalDocs);
    const consoleButtonLabel = (executeMode) ? 'Hide Console' : 'Show Console';

    return (
      <OptionsContext.Consumer>
        {options => (
          <OperationRow>
            <MiddlePanel>
              <H2>
                <ShareLink to={operation.id} />
                {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
              </H2>
              {options.enableConsole &&
                <FlexLayoutReverse>
                  <ConsoleButton onClick={this.onConsoleClick}>{consoleButtonLabel}</ConsoleButton>
                </FlexLayoutReverse>
              }
              {options.pathInMiddlePanel && <Endpoint operation={operation} inverted={true} />}
              {hasDescription && (
                <Description>
                  {description !== undefined && <Markdown source={description} />}
                  {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
                </Description>
              )}
              <Extensions extensions={operation.extensions} />
              <SecurityRequirements securities={operation.security} />
              <Parameters parameters={operation.parameters} body={operation.requestBody} />
              <ResponsesList responses={operation.responses} />
            </MiddlePanel>
            <DarkRightPanel>
              {!options.pathInMiddlePanel && <Endpoint operation={operation} />}
              {executeMode &&
                <div>
                  <ConsoleViewer operation={operation} additionalHeaders={options.additionalHeaders} queryParamPrefix={options.queryParamPrefix} queryParamSuffix={options.queryParamSuffix} />
                </div>
              }
              {!executeMode &&
                <RequestSamples operation={operation} />
              }
              {!executeMode &&
                <ResponseSamples operation={operation} />
              }
            </DarkRightPanel>
          </OperationRow>
        )}
      </OptionsContext.Consumer>
    );
  }
}
