type ParameterLike = {
  name: string;
  in?: string;
  style?: string;
  explode?: boolean;
};

export function serializeParameterValue(param: ParameterLike, value: unknown): string {
  if (value === undefined || value === null) return '';

  const style = param.style ?? getDefaultStyle(param.in);
  const explode = param.explode ?? style === 'form';

  switch (param.in) {
    case 'path':
      return serializePath(param.name, style, explode, value);
    case 'query':
    case 'querystring':
      return serializeQuery(param.name, style, explode, value);
    case 'header':
      return serializeHeader(style, explode, value);
    case 'cookie':
      return serializeCookie(param.name, style, explode, value);
    default:
      return String(value);
  }
}

function getDefaultStyle(location?: string): string {
  switch (location) {
    case 'query':
    case 'querystring':
    case 'cookie':
      return 'form';
    case 'path':
    case 'header':
      return 'simple';
    default:
      return 'simple';
  }
}

function serializePath(name: string, style: string, explode: boolean, value: unknown): string {
  if (Array.isArray(value)) {
    const separator = explode
      ? style === 'label'
        ? '.'
        : style === 'matrix'
          ? `;${name}=`
          : ','
      : style === 'label'
        ? '.'
        : ',';
    const prefix = style === 'label' ? '.' : style === 'matrix' ? `;${name}=` : '';
    return prefix + value.map(String).join(separator);
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (style === 'label') {
      return (
        '.' +
        entries.map(([k, v]) => (explode ? `${k}=${String(v)}` : `${k},${String(v)}`)).join('.')
      );
    }
    if (style === 'matrix') {
      return explode
        ? entries.map(([k, v]) => `;${k}=${String(v)}`).join('')
        : `;${name}=` + entries.map(([k, v]) => `${k},${String(v)}`).join(',');
    }
    return explode
      ? entries.map(([k, v]) => `${k}=${String(v)}`).join(',')
      : entries.map(([k, v]) => `${k},${String(v)}`).join(',');
  }
  if (style === 'label') return '.' + String(value);
  if (style === 'matrix') return `;${name}=${String(value)}`;
  return String(value);
}

function serializeQuery(name: string, style: string, explode: boolean, value: unknown): string {
  if (Array.isArray(value)) {
    if (style === 'form') {
      return explode
        ? value.map((v) => `${encodeURIComponent(name)}=${encodeURIComponent(String(v))}`).join('&')
        : `${encodeURIComponent(name)}=${value.map((v) => encodeURIComponent(String(v))).join(',')}`;
    }
    if (style === 'spaceDelimited') {
      return `${encodeURIComponent(name)}=${value.map((v) => encodeURIComponent(String(v))).join('%20')}`;
    }
    if (style === 'pipeDelimited') {
      return `${encodeURIComponent(name)}=${value.map((v) => encodeURIComponent(String(v))).join('|')}`;
    }
    return `${encodeURIComponent(name)}=${value.map((v) => encodeURIComponent(String(v))).join(',')}`;
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (style === 'deepObject') {
      return entries
        .map(
          ([k, v]) =>
            `${encodeURIComponent(name)}[${encodeURIComponent(k)}]=${encodeURIComponent(String(v ?? ''))}`,
        )
        .join('&');
    }
    if (style === 'form' && explode) {
      return entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v ?? ''))}`)
        .join('&');
    }
    return `${encodeURIComponent(name)}=${entries.map(([k, v]) => `${encodeURIComponent(k)},${encodeURIComponent(String(v ?? ''))}`).join(',')}`;
  }
  return `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`;
}

function serializeHeader(_style: string, explode: boolean, value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(String).join(',');
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    return explode
      ? entries.map(([k, v]) => `${k}=${String(v)}`).join(',')
      : entries.map(([k, v]) => `${k},${String(v)}`).join(',');
  }
  return String(value);
}

function serializeCookie(name: string, _style: string, explode: boolean, value: unknown): string {
  if (Array.isArray(value)) {
    return explode
      ? value.map((v) => `${name}=${String(v)}`).join('; ')
      : `${name}=${value.map(String).join(',')}`;
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    return explode
      ? entries.map(([k, v]) => `${k}=${String(v)}`).join('; ')
      : `${name}=${entries.map(([k, v]) => `${k},${String(v)}`).join(',')}`;
  }
  return `${name}=${String(value)}`;
}
