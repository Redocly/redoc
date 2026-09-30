import type { Node } from '@markdoc/markdoc';
import type { MarkdocTagSchema } from '@redocly/theme/markdoc/tags/types';

export const schemaDefinitionTag: MarkdocTagSchema = {
  render: 'SchemaDefinition',
  attributes: {
    schemaRef: {
      type: String,
    },
    exampleRef: {
      type: String,
    },
    showReadOnly: {
      type: Boolean,
    },
    showWriteOnly: {
      type: Boolean,
    },
    htmlWrap: {
      type: String,
      default: false,
    },
  },
  renderForLlms: (node: Node) => {
    const ref = node.attributes.schemaRef as string | undefined;
    return ref ? `Schema: ${ref}` : '';
  },
};
