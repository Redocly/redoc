import { observer } from 'mobx-react';
import * as React from 'react';

import { SECTION_ATTR } from '../../services/MenuStore';
import { Markdown } from '../Markdown/Markdown';

import { EmptyDarkRightPanel, H1, MiddlePanel, Row, ShareLink } from '../../common-elements';
import { ContentItemModel } from '../../services/MenuBuilder';
import { OperationModel } from '../../services/models';
import { Operation } from '../Operation/Operation';

@observer
export class ContentItems extends React.Component<{
  items: ContentItemModel[];
}> {
  render() {
    const items = this.props.items;
    if (items.length === 0) {
      return null;
    }
    return items.map(item => <ContentItem item={item} key={item.id} />);
  }
}

interface ContentItemProps {
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
      <Row>
        <MiddlePanel key="middle">
          <H1>
            <ShareLink href={'#' + this.props.item.id} />
            {name}
          </H1>
          {description !== undefined && <Markdown source={description} />}
        </MiddlePanel>
        <EmptyDarkRightPanel key="right" />
      </Row>
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
