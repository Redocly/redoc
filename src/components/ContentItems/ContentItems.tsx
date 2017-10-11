import * as React from 'react';
import { observer } from 'mobx-react';

import { SECTION_ATTR } from '../../services/MenuStore';
import { Markdown } from '../Markdown/Markdown';

import { H1, MiddlePanel, ShareLink } from '../../common-elements';
import { Operation } from '../Operation/Operation';
import { ContentItemModel } from '../../services/MenuBuilder';
import { OperationModel } from '../../services/models';

@observer
export class ContentItems extends React.Component<{
  items: ContentItemModel[];
}> {
  render() {
    const items = this.props.items;
    if (items.length === 0) return null;
    return items.map(item => <ContentItem item={item} key={item.id} />);
  }
}

type ContentItemProps = {
  item: ContentItemModel;
};

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
        content = <TagItem item={item} />;
        break;
      case 'section':
        return null;
      case 'operation':
        content = <OperationItem item={item as any} />;
        break;
      default:
        throw new Error('Unknown item type');
    }

    return [
      <div key="section" {...{ [SECTION_ATTR]: item.id }}>
        {content}
      </div>,
      (item as any).items && <ContentItems key="content" items={(item as any).items} />,
    ];
  }
}

@observer
export class TagItem extends React.Component<ContentItemProps> {
  render() {
    const { name, description } = this.props.item;
    return (
      <MiddlePanel>
        <H1>
          <ShareLink href={'#' + this.props.item.getHash()} />
          {name}
        </H1>
        {description !== undefined && <Markdown source={description} />}
      </MiddlePanel>
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
