function isCollapsible(value: any): boolean {
  if (value === null || value === undefined || typeof value !== 'object') {
    return false;
  }
  if (value.constructor === Date) {
    return false;
  }
  if (value.constructor === Array) {
    return value.length > 0;
  }
  return Object.keys(value).length > 0;
}

let level = 1;

export function jsonToHTML(json, maxExpandLevel) {
  level = 1;
  let output = '';
  output += '<div class="redoc-json" role="tree">';
  output += '<code>';
  output += valueToHTML(json, maxExpandLevel);
  output += '</code>';
  output += '</div>';
  return output;
}

function htmlEncode(t) {
  return t !== undefined
    ? t
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    : '';
}

function stringifyStringLiteral(str: string) {
  return JSON.stringify(str).slice(1, -1);
}

function decorateWithSpan(value, className) {
  return '<span class="' + className + '">' + htmlEncode(value) + '</span>';
}

function punctuation(val) {
  return '<span class="token punctuation">' + val + '</span>';
}

function valueToHTML(value, maxExpandLevel: number) {
  const valueType = typeof value;
  let output = '';
  if (value === undefined || value === null) {
    output += decorateWithSpan('null', 'token keyword');
  } else if (value && value.constructor === Array) {
    level++;
    output += arrayToHTML(value, maxExpandLevel);
    level--;
  } else if (value && value.constructor === Date) {
    output += decorateWithSpan('"' + value.toISOString() + '"', 'token string');
  } else if (valueType === 'object') {
    level++;
    output += objectToHTML(value, maxExpandLevel);
    level--;
  } else if (valueType === 'number') {
    output += decorateWithSpan(value, 'token number');
  } else if (valueType === 'string') {
    if (/^(http|https):\/\/[^\s]+$/.test(value)) {
      output +=
        decorateWithSpan('"', 'token string') +
        '<a href="' +
        encodeURI(value) +
        '">' +
        htmlEncode(stringifyStringLiteral(value)) +
        '</a>' +
        decorateWithSpan('"', 'token string');
    } else {
      output += decorateWithSpan('"' + stringifyStringLiteral(value) + '"', 'token string');
    }
  } else if (valueType === 'boolean') {
    output += decorateWithSpan(value, 'token boolean');
  }

  return output;
}

function arrayToHTML(json, maxExpandLevel: number) {
  const collapsed = level > maxExpandLevel ? 'collapsed' : '';
  let output = `<button type="button" class="collapser" aria-label="${
    collapsed ? 'expand array' : 'collapse array'
  }" aria-expanded="${level <= maxExpandLevel}"></button>${punctuation(
    '[',
  )}<span class="ellipsis"></span><ul class="array collapsible" role="group">`;
  let hasContents = false;
  const length = json.length;
  for (let i = 0; i < length; i++) {
    hasContents = true;
    const isChildCollapsible = isCollapsible(json[i]);
    const collapsedClass = level > maxExpandLevel ? 'collapsed' : '';
    const ariaExpanded = isChildCollapsible
      ? ` aria-expanded="${level + 1 <= maxExpandLevel}"`
      : '';
    output += `<li role="treeitem"${ariaExpanded}><div class="hoverable ${collapsedClass}">`;
    output += valueToHTML(json[i], maxExpandLevel);
    if (i < length - 1) {
      output += ',';
    }
    output += '</div></li>';
  }
  output += `</ul>${punctuation(']')}`;
  if (!hasContents) {
    output = punctuation('[ ]');
  }
  return output;
}

function objectToHTML(json, maxExpandLevel: number) {
  const collapsed = level > maxExpandLevel ? 'collapsed' : '';
  const keys = Object.keys(json);
  const length = keys.length;
  let output = `<button type="button" class="collapser" aria-label="${
    collapsed ? 'expand object' : 'collapse object'
  }" aria-expanded="${level <= maxExpandLevel}"></button>${punctuation(
    '{',
  )}<span class="ellipsis"></span><ul class="obj collapsible" role="group">`;
  let hasContents = false;
  for (let i = 0; i < length; i++) {
    const key = keys[i];
    hasContents = true;
    const isChildCollapsible = isCollapsible(json[key]);
    const collapsedClass = level > maxExpandLevel ? 'collapsed' : '';
    const ariaExpanded = isChildCollapsible
      ? ` aria-expanded="${level + 1 <= maxExpandLevel}"`
      : '';
    output += `<li role="treeitem"${ariaExpanded}><div class="hoverable ${collapsedClass}">`;
    output += '<span class="property token string">"' + htmlEncode(key) + '"</span>: ';
    output += valueToHTML(json[key], maxExpandLevel);
    if (i < length - 1) {
      output += punctuation(',');
    }
    output += '</div></li>';
  }
  output += `</ul>${punctuation('}')}`;
  if (!hasContents) {
    output = punctuation('{ }');
  }
  return output;
}
