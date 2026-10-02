import { memo } from 'react';

import type { ReactElement } from 'react';
import type { ExtensionsNode } from '../types/content.js';

import { VendorExtensions } from './common/VendorExtensions.js';

function ExtensionsItemComponent({ node }: { node: ExtensionsNode }): ReactElement {
  return <VendorExtensions extensions={node.extensions} />;
}

export const ExtensionsItem = memo(ExtensionsItemComponent);
