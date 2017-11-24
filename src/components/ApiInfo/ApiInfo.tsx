import * as React from 'react';
import { observer } from 'mobx-react';

import { AppStore } from '../../services/AppStore';

import { SecurityDefs } from '../SecuritySchemes/SecuritySchemes';
import { Markdown } from '../Markdown/Markdown';
import { MiddlePanel, DarkRightPanel, Row } from '../../common-elements/';

import {
  ApiHeader,
  DownloadButton,
  InfoSpan,
  InfoSpanBoxWrap,
  InfoSpanBox,
} from './styled.elements';

interface ApiInfoProps {
  store: AppStore;
}

@observer
export class ApiInfo extends React.Component<ApiInfoProps> {
  render() {
    const { store } = this.props;
    const { info, externalDocs } = store.spec;

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
          {downloadLink && (
            <p>
              Download OpenAPI specification:
              <DownloadButton download={downloadFilename} target="_blank" href={downloadLink}>
                Download
              </DownloadButton>
            </p>
          )}

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

          <div>
            <Markdown
              source={info.description || ''}
              raw={false}
              components={{
                'security-definitions': {
                  component: SecurityDefs,
                  propsSelector: store => ({
                    securitySchemes: store!.spec.securitySchemes,
                  }),
                },
              }}
              store={store}
            />
          </div>
        </MiddlePanel>
        <DarkRightPanel />
      </Row>
    );
  }
}
