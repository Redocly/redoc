import * as React from 'react';
import * as PropTypes from 'prop-types';
import { getContext } from 'recompose';
import { observer } from 'mobx-react';

import { BaseContainerProps } from '../../types/components';
import { ContentItems } from './ContentItems';

@observer
export class ContentContainer extends React.Component<BaseContainerProps> {
  render() {
    const items = this.props.store.menu.items;
    return <ContentItems items={items as any} />;
  }
}

export default getContext<BaseContainerProps>({
  store: PropTypes.object,
})(ContentContainer);
