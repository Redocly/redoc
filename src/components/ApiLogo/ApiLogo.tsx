import { OpenAPIInfo } from '../../types';
import * as React from 'react';
import { observer } from 'mobx-react';
import { LogoImgEl } from './styled.elements';

const LinkWrap = url => Component => <a href={url}>{Component}</a>;

@observer
export class ApiLogo extends React.Component<{ info: OpenAPIInfo }> {
  render() {
    const { info } = this.props;
    const logoInfo = info['x-logo'];
    if (!logoInfo || !logoInfo.url) return null;

    const logo = (
      <LogoImgEl src={logoInfo.url} style={{ backgroundColor: logoInfo.backgroundColor }} />
    );
    return info.contact && info.contact.url ? LinkWrap(info.contact.url)(logo) : logo;
  }
}
