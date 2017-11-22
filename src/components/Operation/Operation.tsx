import * as React from 'react';
import styled from '../../styled-components';

import { observer } from 'mobx-react';

import { H2, MiddlePanel, DarkRightPanel, Badge, Row } from '../../common-elements';

import { ComponentWithOptions } from '../OptionsProvider';

import { Markdown } from '../Markdown/Markdown';
import { Parameters } from '../Parameters/Parameters';
import { ResponsesList } from '../Responses/ResponsesList';
import { RequestSamples } from '../RequestSamples/RequestSamples';
import { ResponseSamples } from '../ResponseSamples/ResponseSamples';
import { ShareLink } from '../../common-elements/linkify';
import { Endpoint } from '../Endpoint/Endpoint';

import { OperationModel as OperationType } from '../../services/models';

const OperationRow = styled(Row)`
  transform: translateZ(0);
  overflow: hidden;
  positioin: relative;

  &:after {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: block;
    content: '';
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

interface OperationProps {
  operation: OperationType;
}

@observer
export class Operation extends ComponentWithOptions<OperationProps> {
  render() {
    const { operation } = this.props;

    const { name: summary, description, deprecated } = operation;
    const pathInMiddle = this.options.pathInMiddlePanel;

    return (
      <OperationRow>
        <MiddlePanel>
          <H2>
            <ShareLink href={'#' + operation.getHash()} />
            {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
          </H2>
          {pathInMiddle && <Endpoint operation={operation} inverted={true} />}
          {description !== undefined && <Markdown source={description} />}
          <Parameters parameters={operation.parameters} body={operation.requestBody} />
          <ResponsesList responses={operation.responses} />
        </MiddlePanel>
        <DarkRightPanel>
          {!pathInMiddle && <Endpoint operation={operation} />}
          <RequestSamples operation={operation} />
          <ResponseSamples operation={operation} />
        </DarkRightPanel>
      </OperationRow>
    );
  }
}
