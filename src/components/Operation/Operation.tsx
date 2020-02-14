import { observer } from 'mobx-react';
import * as React from 'react';
import { OperationPanel } from '../RightPanelContent/OperationPanel';

import { Badge, DarkRightPanel, H2, MiddlePanel, Row } from '../../common-elements';

import { OperationModel as OperationType } from '../../services/models';
import styled from '../../styled-components';
import { Endpoint } from '../Endpoint/Endpoint';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Extensions } from '../Fields/Extensions';
import { Markdown } from '../Markdown/Markdown';

import { shortenHTTPVerb } from '../../utils';
import { OptionsContext } from '../OptionsProvider';
import { Parameters } from '../Parameters/Parameters';
import { ResponsesList } from '../Responses/ResponsesList';
import { SecurityRequirements } from '../SecurityRequirement/SecurityRequirement';
import { OperationBadge } from '../SideMenu';

const OperationRow = styled(Row)`
  backface-visibility: hidden;
  contain: content;

  overflow: hidden;
`;

const Description = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.unit * 6}px;
`;

export interface OperationProps {
  operation: OperationType;
}

@observer
export class Operation extends React.Component<OperationProps> {
  render() {
    const {operation} = this.props;

    const {name: summary, description, deprecated, externalDocs} = operation;
    const hasDescription = !!(description || externalDocs);

    return (
      <OptionsContext.Consumer>
        {options => (
          <OperationRow>
            <MiddlePanel>
              <div style={{display: 'flex'}}>
                <div style={{zoom: '125%'}}>
                  <OperationBadge type={operation.httpVerb}>{shortenHTTPVerb(operation.httpVerb)}</OperationBadge>
                </div>
                <div style={{margin: '-5px 0 0 7px'}}>
                  <div style={{fontWeight: 'bolder'}}>
                    <H2>
                      {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
                    </H2>
                  </div>
                  <div>
                    {options.pathInMiddlePanel && <Endpoint operation={operation} inverted={true}/>}
                    {hasDescription && (
                      <Description>
                        {description !== undefined && <Markdown source={description}/>}
                        {externalDocs && <ExternalDocumentation externalDocs={externalDocs}/>}
                      </Description>
                    )}
                  </div>
                </div>
              </div>
              <Extensions extensions={operation.extensions}/>
              <SecurityRequirements securities={operation.security}/>
              <Parameters parameters={operation.parameters} body={operation.requestBody}/>
              <ResponsesList responses={operation.responses}/>
            </MiddlePanel>
            <DarkRightPanel>
              <OperationPanel operation={operation} options={options}/>
            </DarkRightPanel>
          </OperationRow>
        )}
      </OptionsContext.Consumer>
    );
  }
}
