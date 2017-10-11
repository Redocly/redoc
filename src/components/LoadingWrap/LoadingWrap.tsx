import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Children } from 'react';
import { getContext } from 'recompose';
import { observer } from 'mobx-react';
import styled from '../../styled-components';

import { AppStore } from '../../services';
import { Spinner } from './Spinner.svg';

const LoadingMessage = styled.div`
  font-family: ${props => props.theme.baseFont.family};
  width: 100%;
  text-align: center;
  font-size: 25px;
  margin: 30px 0 20px 0;
  color: ${props => props.theme.colors.main};
`;

@observer
class LoadingWrap extends React.Component<{ store: AppStore }> {
  render() {
    if (this.props.store.spec.loaded) {
      return Children.only(this.props.children);
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <LoadingMessage>Loading ...</LoadingMessage>
        <Spinner />
      </div>
    );
  }
}

export default getContext<{ store: AppStore }>({
  store: PropTypes.object,
})(LoadingWrap);
