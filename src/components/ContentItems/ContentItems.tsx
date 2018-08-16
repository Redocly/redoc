import { observer } from 'mobx-react';
import * as React from 'react';

import { AdvancedMarkdown } from '../Markdown/AdvancedMarkdown';

import { H1, H2, MiddlePanel, Row, Section, ShareLink } from '../../common-elements';
import { MDXComponentMeta } from '../../services/MarkdownRenderer';
import { ContentItemModel } from '../../services/MenuBuilder';
import { GroupModel, OperationModel } from '../../services/models';
import { Operation } from '../Operation/Operation';
import { SecurityDefs } from '../SecuritySchemes/SecuritySchemes';
import { StoreConsumer } from '../StoreBuilder';

const DEFAULT_ALLOWED_COMPONENTS = {
  'security-definitions': {
    component: SecurityDefs,
    propsSelector: _store => ({
      securitySchemes: _store!.spec.securitySchemes,
    }),
  },
};

@observer
export class ContentItems extends React.Component<{
  items: ContentItemModel[];
  allowedMdComponents?: Dict<MDXComponentMeta>;
}> {
  static defaultProps = {
    allowedMdComponents: DEFAULT_ALLOWED_COMPONENTS,
  };

  render() {
    const items = this.props.items;
    if (items.length === 0) {
      return null;
    }
    return items.map(item => (
      <ContentItem
        item={item}
        key={item.id}
        allowedMdComponents={this.props.allowedMdComponents!}
      />
    ));
  }
}

export interface ContentItemProps {
  item: ContentItemModel;
  allowedMdComponents: Dict<MDXComponentMeta>;
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
        content = <SectionItem {...this.props} />;
        break;
      case 'section':
        content = <SectionItem {...this.props} />;
        break;
      case 'operation':
        content = <OperationItem item={item as any} />;
        break;
      default:
        throw new Error('Unknown item type');
    }

    return (
      <>
        <Section id={item.id} underlined={item.type === 'section'}>
          {content}
        </Section>
        {item.items && (
          <ContentItems items={item.items} allowedMdComponents={this.props.allowedMdComponents} />
        )}
      </>
    );
  }
}

const middlePanelWrap = component => <MiddlePanel>{component}</MiddlePanel>;

@observer
export class SectionItem extends React.Component<ContentItemProps> {
  render() {
    const { name, description, level } = this.props.item as GroupModel;
    const components = this.props.allowedMdComponents;
    const Header = level === 2 ? H2 : H1;
    return (
      <>
        <Row>
          <MiddlePanel>
            <Header>
              <ShareLink href={'#' + this.props.item.id} />
              {name}
            </Header>
          </MiddlePanel>
        </Row>
        <StoreConsumer>
          {store => (
            <AdvancedMarkdown
              source={description || ''}
              allowedComponents={components}
              store={store}
              htmlWrap={middlePanelWrap}
            />
          )}
        </StoreConsumer>
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
