import { memo, type FC, type ReactElement } from 'react';

import type { ContentType, NodeTypes } from '../types/common.js';
import type {
  ApiItemContent,
  ContentNode,
  ContainerNode,
  HeaderNode,
  ItemContentNode,
  OverviewSectionWrapperNode,
} from '../types/content.js';

import { SECTION_ATTR } from '../constants/openapi.js';
import { contentType, nodeTypes } from '../types/common.js';
import { OverviewPage } from '../pages/OverviewPage.js';
import { ItemPage } from '../pages/ItemPage.js';
import { GroupPage } from '../pages/GroupPage.js';
import { HeaderItem } from './Header/HeaderItem.js';
import { EmptyMessageItem } from './EmptyMessageItem.js';
import { MarkdownItem } from './MarkdownItem.js';
import { AdmonitionItem } from './AdmonitionItem.js';
import { InfoMetadataItem } from './InfoMetadataItem.js';
import { ContainerItem } from './ContainerItem.js';
import { ItemContentRenderer } from './ItemContent/ItemContentRenderer.js';
import { SecuritySection } from './Security/SecuritySection.js';
import { ExtensionsItem } from './ExtensionsItem.js';
import { ExternalDocsItem } from './ExternalDocsItem.js';
import { ChannelAddressItem } from './ChannelAddressItem.js';
import { MessageLinksItem } from './MessageLinksItem.js';

export const ContentTypeMapper: Record<ContentType, FC<unknown>> = {
  [contentType.OVERVIEW]: OverviewPage as FC<unknown>,
  [contentType.GROUP]: GroupPage as FC<unknown>,
  [contentType.ITEM]: ItemPage as FC<unknown>,
};

/** Renders overview sections; lives in this module to avoid Mapper ↔ OverviewSectionWrapper circular imports. */
const OverviewSectionWrapperView = memo(function OverviewSectionWrapperView({
  node,
  itemPath,
}: {
  node: OverviewSectionWrapperNode;
  itemPath?: string;
}): ReactElement {
  const { children, sectionId } = node;
  const mapped = children?.map((child, index) => (
    <ComponentMapper
      type={child.nodeType}
      node={child}
      key={`${node.nodeType}_${child.nodeType}_${index}`}
      parentNode={node}
      itemPath={itemPath}
    />
  ));
  const sectionAttrProps = sectionId ? { [SECTION_ATTR]: sectionId } : {};
  return (
    <div id={itemPath} {...sectionAttrProps}>
      {mapped}
    </div>
  );
});

export const NodeTypeMapper: Record<NodeTypes, FC<unknown>> = {
  [nodeTypes.CONTAINER]: ContainerItem as FC<unknown>,
  [nodeTypes.OVERVIEW_SECTION_WRAPPER]: OverviewSectionWrapperView as FC<unknown>,
  [nodeTypes.HEADER]: HeaderItem as FC<unknown>,
  [nodeTypes.EMPTY_MESSAGE]: EmptyMessageItem as unknown as FC<unknown>,
  [nodeTypes.ITEM]: ItemContentRenderer as FC<unknown>,
  [nodeTypes.SECURITY]: SecuritySection as FC<unknown>,
  [nodeTypes.MARKDOC]: MarkdownItem as unknown as FC<unknown>,
  [nodeTypes.ADMONITION]: AdmonitionItem as unknown as FC<unknown>,
  [nodeTypes.EXTERNAL_DOCS]: ExternalDocsItem as unknown as FC<unknown>,
  [nodeTypes.CHANNEL_ADDRESS]: ChannelAddressItem as unknown as FC<unknown>,
  [nodeTypes.MESSAGE_LINKS]: MessageLinksItem as unknown as FC<unknown>,
  [nodeTypes.INFO_METADATA]: InfoMetadataItem as unknown as FC<unknown>,
  [nodeTypes.EXTENSIONS]: ExtensionsItem as FC<unknown>,
};

export const Mapper = {
  ...ContentTypeMapper,
  ...NodeTypeMapper,
} as Record<ContentType | NodeTypes, FC<unknown>>;

export type ContentPageProps = {
  content: ApiItemContent;
  itemPath: string;
  sectionId?: string;
};
export type ContentNodeProps = {
  node: ContentNode;
  parentNode?: ContentNode;
  slot?: ReactElement;
  itemPath?: string;
  sectionId?: string;
};

export function ComponentMapper(
  props: { type: ContentType; sectionId?: string } & ContentPageProps,
): ReactElement;
export function ComponentMapper(props: { type: NodeTypes } & ContentNodeProps): ReactElement;

export function ComponentMapper(
  props:
    | ({ type: ContentType; sectionId?: string } & ContentPageProps)
    | ({ type: NodeTypes } & ContentNodeProps),
): ReactElement {
  const { type, ...rest } = props;

  if (type === nodeTypes.HEADER) {
    const { node, parentNode, itemPath = '' } = rest as ContentNodeProps;
    return <HeaderItem node={node as HeaderNode} path={itemPath} parentNode={parentNode} />;
  }

  const isContentPage =
    type === contentType.GROUP || type === contentType.ITEM || type === contentType.OVERVIEW;

  if (isContentPage) {
    const { content, itemPath, sectionId } = rest as ContentPageProps & {
      sectionId?: string;
    };
    const PageComponent = Mapper[type] as FC<ContentPageProps>;
    return <PageComponent content={content} itemPath={itemPath} sectionId={sectionId} />;
  }

  if (type === nodeTypes.OVERVIEW_SECTION_WRAPPER) {
    const { node, itemPath } = rest as ContentNodeProps;
    return (
      <OverviewSectionWrapperView node={node as OverviewSectionWrapperNode} itemPath={itemPath} />
    );
  }

  if (type === nodeTypes.CONTAINER) {
    const { node, itemPath, sectionId } = rest as ContentNodeProps;
    return <ContainerItem node={node as ContainerNode} itemPath={itemPath} sectionId={sectionId} />;
  }

  const { itemPath, sectionId: _s, ...nodeOnly } = rest as ContentNodeProps;

  if (type === nodeTypes.ITEM) {
    return <ItemContentRenderer node={nodeOnly.node as ItemContentNode} />;
  }

  const componentProps: ContentNodeProps = { ...nodeOnly, itemPath };
  const Component = Mapper[type] as FC<ContentNodeProps>;
  return <Component {...componentProps} />;
}
