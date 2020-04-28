import { observer } from 'mobx-react';
import * as React from 'react';
import { ApiBackToText } from './styled.elements';

@observer
export class ApiBackTo extends React.Component<{ isOt2: boolean }> {
  state = {
    backTextColor: '#0084CE'
  };

  handleHoverState = () => {this.setState({backTextColor: '#004267'})};
  handleLeaveState = () => {this.setState({backTextColor: '#0084CE'})};
  render() {
    const { isOt2 } = this.props;
    return(
      <div>
        <ApiBackToText href={isOt2?'/apis': '/apis/other'}
                       onMouseEnter={this.handleHoverState}
                       onMouseLeave={this.handleLeaveState}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 22L2 11.5L12.5 1" stroke={this.state.backTextColor} strokeWidth="2" strokeLinecap="round"/>
          </svg>

          {isOt2 ? <span style={{color: this.state.backTextColor}}>OT2 services</span>
                 : <span style={{color: this.state.backTextColor}}>OpenText products</span>}
        </ApiBackToText>
      </div>
    );
  }
}
