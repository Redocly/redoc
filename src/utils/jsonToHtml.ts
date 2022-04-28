let level = 1;

export function jsonToHTML(json, maxExpandLevel) {
  level = 1;
  let output = '';
  output += '<div class="redoc-json">';
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
  let output = `<button class="collapser" aria-label="${
    level > maxExpandLevel + 1 ? 'expand' : 'collapse'
  }"></button>${punctuation('[')}<span class="ellipsis"></span><ul class="array collapsible">`;
  let hasContents = false;
  const length = json.length;
  for (let i = 0; i < length; i++) {
    hasContents = true;
    output += '<li><div class="hoverable ' + collapsed + '">';
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
  let output = `<button class="collapser" aria-label="${
    level > maxExpandLevel + 1 ? 'expand' : 'collapse'
  }"></button>${punctuation('{')}<span class="ellipsis"></span><ul class="obj collapsible">`;
  let hasContents = false;
  for (let i = 0; i < length; i++) {
    const key = keys[i];
    hasContents = true;
    output += '<li><div class="hoverable ' + collapsed + '">';
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
