import { observer } from 'mobx-react';
import * as React from 'react';
import { StyledLink } from '../../../src/common-elements';

import { AppStore } from '../../services/AppStore';

import { MiddlePanel, Row, Section } from '../../common-elements/';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Markdown } from '../Markdown/Markdown';
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
          License: <StyledLink href={info.license.url}>{info.license.name}</StyledLink>
        </InfoSpan>
      )) ||
      null;

    const website =
      (info.contact &&
        info.contact.url && (
          <InfoSpan>
            URL: <StyledLink href={info.contact.url}>{info.contact.url}</StyledLink>
          </InfoSpan>
        )) ||
      null;

    const email =
      (info.contact &&
        info.contact.email && (
          <InfoSpan>
            {info.contact.name || 'E-mail'}:{' '}
            <StyledLink href={'mailto:' + info.contact.email}>{info.contact.email}</StyledLink>
          </InfoSpan>
        )) ||
      null;

    const terms =
      (info.termsOfService && (
        <InfoSpan>
          <StyledLink href={info.termsOfService}>Terms of Service</StyledLink>
        </InfoSpan>
      )) ||
      null;

    const version =
      (info.version && (
        <span>({info.version})</span>
      )) ||
      null;

    return (
      <Section>
        <Row>
          <MiddlePanel className="api-info">
            <ApiHeader>
              {info.title} {version}
            </ApiHeader>
            {!hideDownloadButton && (
              <p>
                Download OpenAPI specification:
                <DownloadButton
                  download={downloadFilename}
                  target="_blank"
                  href={downloadLink}
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
            </StyledMarkdownBlock>
            <Markdown source={store.spec.info.description} />
            {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
          </MiddlePanel>
        </Row>
      </Section>
    );
  }
}
