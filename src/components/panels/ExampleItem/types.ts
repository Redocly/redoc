import type { ReactElement } from 'react';
import type { ExamplePanelItem } from '../../../types/content.js';

export type ExamplesItemProps = {
  item: ExamplePanelItem;
};

export type ExampleKind = ExamplePanelItem['kind'];
export type KindRenderer = ({ node }: { node: ExamplePanelItem }) => ReactElement;
