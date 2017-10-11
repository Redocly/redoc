import * as React from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { getContext } from 'recompose';

import { BaseContainerProps } from '../../types/components';
import { ApiInfo } from './ApiInfo';

@observer
export class ApiInfoContainer extends React.Component<BaseContainerProps> {
  render() {
    const { info, externalDocs } = this.props.store.spec;
    return <ApiInfo info={info!} externalDocs={externalDocs!} />;
  }
}

export default getContext<BaseContainerProps>({
  store: PropTypes.object,
})(ApiInfoContainer);
