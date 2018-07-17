import { observer } from 'mobx-react';
import * as React from 'react';

import { AppStore } from '../../services/AppStore';

import { MiddlePanel, Row } from '../../common-elements/';

import { StyledMarkdownBlock } from '../Markdown/styled.elements';
import {
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
  handleDownloadClick = e => {
    if (!e.target.href) {
      e.target.href = this.props.store.spec.info.downloadLink;
    }
  };

  render() {
    const { store } = this.props;
    const { info, externalDocs } = store.spec;
    const hideDownloadButton = store.options.hideDownloadButton;

    const downloadFilename = info.downloadFileName;
    const downloadLink = info.downloadLink;

    const license =
      (info.license && (
        <InfoSpan>
          License: <a href={info.license.url}>{info.license.name}</a>
        </InfoSpan>
      )) ||
      null;

    const website =
      (info.contact &&
        info.contact.url && (
          <InfoSpan>
            URL: <a href={info.contact.url}>{info.contact.url}</a>
          </InfoSpan>
        )) ||
      null;

    const email =
      (info.contact &&
        info.contact.email && (
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

    return (
      <Row>
        <MiddlePanel className="api-info">
          <ApiHeader>
            {info.title} <span>({info.version})</span>
          </ApiHeader>
          {!hideDownloadButton && (
            <p>
              Download OpenAPI specification:
              <DownloadButton
                download={downloadFilename}
                target="_blank"
                href={downloadLink || '#'}
                onClick={this.handleDownloadClick}
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

            {(externalDocs && (
              <p>
                <a href={externalDocs.url}>{externalDocs.description || externalDocs.url}</a>
              </p>
            )) ||
              null}
          </StyledMarkdownBlock>
        </MiddlePanel>
      </Row>
    );
  }
}
