import { observer } from 'mobx-react';
import * as React from 'react';
import { OpenAPIInfo } from '../../types';
import { LinkWrap, LogoImgEl, LogoWrap } from './styled.elements';

@observer
export class ApiLogo extends React.Component<{ info: OpenAPIInfo }> {
  render() {
    const { info } = this.props;
    const logoInfo = info['x-logo'];
    if (!logoInfo || !logoInfo.url) {
      return null;
    }

    const logoHref = logoInfo.href || (info.contact && info.contact.url);

    // Use the english word logo if no alt text is provided
    const altText = logoInfo.altText ? logoInfo.altText : 'logo';

    const logo = <LogoImgEl src={logoInfo.url} alt={altText} />;
    return (
      <LogoWrap style={{ backgroundColor: logoInfo.backgroundColor }}>
        {logoHref ? LinkWrap(logoHref)(logo) : logo}
      </LogoWrap>
    );
  }
}
