import { observer } from 'mobx-react';
import * as React from 'react';
import { MiddlePanel, Row } from '../../../src/common-elements';

interface ContentPanelProps {
  content: string;
}

@observer
export class ContentPanel extends React.Component<ContentPanelProps> {
  render() {
    return (
      <>
        <Row>
          <MiddlePanel>
            <h3>
              {this.props.content}
            </h3>
          </MiddlePanel>
        </Row>
      </>
    );
  }
}
