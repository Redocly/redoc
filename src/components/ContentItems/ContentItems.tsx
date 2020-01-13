import { observer } from 'mobx-react';
import * as React from 'react';

import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { AdvancedMarkdown } from '../Markdown/AdvancedMarkdown';

import { Operation } from '..';
import { H1, H2, MiddlePanel, Row, Section, ShareLink } from '../../common-elements';
import { ContentItemModel } from '../../services';
import { GroupModel, OperationModel } from '../../services/models';
import styled from '../../styled-components';

const CallbacksHeader = styled.h3`
  font-size: 18px;
  padding: 0 40px;
  margin: 3em 0 1.1em;
  color: #253137;
  font-weight: normal;
`;

@observer
export class ContentItems extends React.Component<{
  items: ContentItemModel[];
}> {
  render() {
    const items = this.props.items;
    if (items.length === 0) {
      return null;
    }
    return items.map(item => {
      if (item.type === 'operation' && item.callbacks.length > 0) {
        return (
          <React.Fragment key={item.id}>
            <ContentItem item={item} />
            <CallbacksHeader>Callbacks</CallbacksHeader>
            {item.callbacks.map((callbackIndex, idx) => {
              return <ContentItems key={idx} items={callbackIndex.operations} />;
            })}
          </React.Fragment>
        );
      }

      return <ContentItem key={item.id} item={item} />;
    });
  }
}

export interface ContentItemProps {
  item: ContentItemModel;
}

@observer
export class ContentItem extends React.Component<ContentItemProps> {
  render() {
    const item = this.props.item;
    let content;
    const { type } = item;
    switch (type) {
      case 'group':
        content = null;
        break;
      case 'tag':
      case 'section':
        content = <SectionItem {...this.props} />;
        break;
      case 'operation':
        content = <OperationItem item={item as any} />;
        break;
      default:
        content = <SectionItem {...this.props} />;
    }

    return (
      <>
        {content && (
          <Section id={item.id} underlined={item.type === 'operation'}>
            {content}
          </Section>
        )}
        {item.items && <ContentItems items={item.items} />}
      </>
    );
  }
}

const middlePanelWrap = component => <MiddlePanel compact={true}>{component}</MiddlePanel>;

@observer
export class SectionItem extends React.Component<ContentItemProps> {
  render() {
    const { name, description, externalDocs, level } = this.props.item as GroupModel;

    const Header = level === 2 ? H2 : H1;
    return (
      <>
        <Row>
          <MiddlePanel compact={false}>
            <Header>
              <ShareLink to={this.props.item.id} />
              {name}
            </Header>
          </MiddlePanel>
        </Row>
        <AdvancedMarkdown source={description || ''} htmlWrap={middlePanelWrap} />
        {externalDocs && (
          <Row>
            <MiddlePanel>
              <ExternalDocumentation externalDocs={externalDocs} />
            </MiddlePanel>
          </Row>
        )}
      </>
    );
  }
}

@observer
export class OperationItem extends React.Component<{
  item: OperationModel;
}> {
  render() {
    return <Operation operation={this.props.item} />;
  }
}
