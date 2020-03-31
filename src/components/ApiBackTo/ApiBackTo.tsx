import { observer } from 'mobx-react';
import * as React from 'react';
import { OpenAPIInfo } from '../../types';
import { ApiBackToText } from './styled.elements';

@observer
export class ApiBackTo extends React.Component<{ info: OpenAPIInfo }> {
  state = {
    backTextColor: '#0084CE'
  };

  handleHoverState = () => {this.setState({backTextColor: '#339DD8'})};
  handleActiveState = () => {this.setState({backTextColor: '#00639B'})};
  handleLeaveState = () => {this.setState({backTextColor: '#0084CE'})};
  render() {
    return(
      <div>
        <ApiBackToText href={'/apis'}
                       onMouseEnter={this.handleHoverState}
                       onMouseDown={this.handleActiveState}
                       onMouseLeave={this.handleLeaveState}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 22L2 11.5L12.5 1" stroke="#0084CE" strokeWidth="2" strokeLinecap="round"/>
          </svg>

          <span style={{marginLeft: '-7px', color: this.state.backTextColor}}>OT2 services</span>
        </ApiBackToText>
      </div>
    );
  }
}
