'use strict';

const visit = require('unist-util-visit');

module.exports = slug;

function slug() {
  return transformer;
}

// Patch slugs on heading nodes.
function transformer(ast) {
  const headlines: any[] = [];
  visit(ast, 'heading', visitor);

  function visitor(node) {
    const data = node.data || (node.data = {});
    const props = data.hProperties || (data.hProperties = {});

    const sectionId = `section/${data.id}`;
    data.id = sectionId;
    props.id = sectionId;

    visit(node, 'text', (textNode) => {
      headlines.push({ depth: node.depth, id: data.id, text: textNode.value });
    });
  }

  const value = `export const headings = ${JSON.stringify(headlines)};`;

  const meta = {
    default: false,
    type: 'export',
    value,
  };

  ast.children.splice(0, 0, meta);
}
