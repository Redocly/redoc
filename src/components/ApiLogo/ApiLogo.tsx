import * as React from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { getContext } from 'recompose';

import { BaseContainerProps } from '../../types/components';
import { LogoImgEl } from './styled.elements';

const LinkWrap = url => Component => <a href={url}>{Component}</a>;

@observer
class ApiLogo extends React.Component<BaseContainerProps> {
  render() {
    const { spec } = this.props.store;
    const info = spec.info!;
    const logoInfo = info['x-logo'];
    if (!logoInfo || !logoInfo.url) return null;

    const logo = (
      <LogoImgEl src={logoInfo.url} style={{ backgroundColor: logoInfo.backgroundColor }} />
    );
    return info.contact && info.contact.url ? LinkWrap(info.contact.url)(logo) : logo;
  }
}

export default getContext<BaseContainerProps>({
  store: PropTypes.object,
})(ApiLogo);
