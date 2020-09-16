import { observer } from 'mobx-react';
import * as React from 'react';

import { AppStore } from '../../services/AppStore';

import { MiddlePanel, Row, Section } from '../../common-elements/';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Markdown } from '../Markdown/Markdown';
import { StyledMarkdownBlock } from '../Markdown/styled.elements';
import {
  AdditionalDocLink,
  ApiHeader,
  DownloadButton,
  InfoSpan,
  InfoSpanBox,
  InfoSpanBoxWrap,
} from './styled.elements';

export interface ApiInfoProps {
  store: AppStore;
}

@observer
export class ApiInfo extends React.Component<ApiInfoProps> {

  state = {
    gotoIconColor: '#0084CE',
    gotoTextColor: '#0084CE'
  };

  handleHoverState = () => { this.setState({ gotoIconColor: '#339DD8', gotoTextColor: '#339DD8' }) };
  handleActiveState = () => { this.setState({ gotoIconColor: '#00639B', gotoTextColor: '#00639B' }) };
  handleLeaveState = () => { this.setState({ gotoIconColor: '#0084CE', gotoTextColor: '#0084CE' }) };

  handleDownloadClick = e => {
    if (!e.target.href) {
      e.target.href = this.props.store.spec.info.downloadLink;
    }
  };

  render() {
    const { store } = this.props;
    const { info, externalDocs } = store.spec;
    const hideDownloadButton = store.options.hideDownloadButton;

    const downloadFilename = info.downloadFileName == undefined ? info.title : info.downloadFileName;
    const downloadLink = info.downloadLink;

    const license =
      (info.license && (
        <InfoSpan>
          License: <a href={info.license.url}>{info.license.name}</a>
        </InfoSpan>
      )) ||
      null;

    const website =
      (info.contact && info.contact.url && (
        <InfoSpan>
          URL: <a href={info.contact.url}>{info.contact.url}</a>
        </InfoSpan>
      )) ||
      null;

    const email =
      (info.contact && info.contact.email && (
        <InfoSpan>
          {info.contact.name || 'E-mail'}:{' '}
          <a href={'mailto:' + info.contact.email}>{info.contact.email}</a>
        </InfoSpan>
      )) ||
      null;

    const terms =
      (info.termsOfService && (
        <InfoSpan>
          <a href={info.termsOfService}>Terms of Service</a>
        </InfoSpan>
      )) ||
      null;

    const version = (info.version && <span>({info.version})</span>) || null;
    const hasAdditionalDoc = store.options.hasAdditionalDoc;

    return (
      <Section>
        <Row>
          <MiddlePanel className="api-info">
            <ApiHeader>
              <div style={{ width: hasAdditionalDoc ? '60%' : '', color: '#111B58', fontWeight: 500 }}>
                {info.title} {version}
              </div>
              {hasAdditionalDoc ? <div style={{ margin: '0 auto' }}
                onMouseEnter={this.handleHoverState}
                onMouseDown={this.handleActiveState}
                onMouseLeave={this.handleLeaveState}>
                <AdditionalDocLink
                  target="_blank"
                  href={store.options.additionalDocUrl}
                >
                  <span style={{ zoom: '1.3' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.75" d="M8 14C4.6912 14 2 11.3088 2 8C2 4.6912 4.6912 2 8 2C11.3088 2 14 4.6912 14 8C14 11.3088 11.3088 14 8 14Z"
                        fill={this.state.gotoIconColor} />
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.799805 8.00005C0.799805 11.9716 4.02826 15.2 7.9998 15.2C11.9713 15.2 15.1998 11.9716 15.1998 8.00005C15.1998 4.02851 11.9713 0.800049 7.9998 0.800049C4.02826 0.800049 0.799805 4.02851 0.799805 8.00005ZM3.32386 11.7561C2.49585 10.7273 1.9998 9.42061 1.9998 8.00005C1.9998 4.69125 4.691 2.00005 7.9998 2.00005C11.3086 2.00005 13.9998 4.69125 13.9998 8.00005C13.9998 11.3088 11.3086 14 7.9998 14C6.58686 14 5.28654 13.5093 4.2603 12.6893L9.87799 7.0716L9.87799 10.0776C9.87799 10.4432 10.1734 10.7386 10.5389 10.7386C10.9044 10.7386 11.1998 10.4432 11.1998 10.0776L11.1998 4.80002L5.92218 4.80002C5.55714 4.79956 5.26127 5.09542 5.26127 5.46093C5.26127 5.82644 5.55667 6.12184 5.92218 6.12184L8.95767 6.12231L3.32386 11.7561Z" fill="white" />
                    </svg>
                  </span>
                  <span style={{
                    paddingLeft: '5px', verticalAlign: 'top',
                    color: this.state.gotoTextColor
                  }}>
                    Additional Docs
                  </span>
                </AdditionalDocLink>
              </div> : null}
            </ApiHeader>
            {!hideDownloadButton && (
              <p>
                Download OpenAPI specification:
                <DownloadButton
                  download={downloadFilename == undefined ? '' : downloadFilename}
                  href={downloadLink}
                >
                  Download
                </DownloadButton>
              </p>
            )}
            <StyledMarkdownBlock>
              {((info.license || info.contact || info.termsOfService) && (
                <InfoSpanBoxWrap>
                  <InfoSpanBox>
                    {email} {website} {license} {terms}
                  </InfoSpanBox>
                </InfoSpanBoxWrap>
              )) ||
                null}
            </StyledMarkdownBlock>
            <Markdown source={store.spec.info.description} data-role="redoc-description" />
            {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
          </MiddlePanel>
        </Row>
      </Section>
    );
  }
}
