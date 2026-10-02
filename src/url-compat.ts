// Node's legacy `url` API, as used by swagger2openapi/oas-resolver, over the WHATWG URL class.
type LegacyUrl = {
  protocol: string | null;
  slashes: boolean;
  auth: string | null;
  host: string | null;
  hostname: string | null;
  port: string | null;
  pathname: string | null;
  search: string | null;
  hash: string | null;
  href: string;
  format(): string;
};

const ABSOLUTE_URL = /^[a-z][a-z0-9+.-]*:\/\//i;

// legacy format() accepts a protocol assigned without its trailing colon
function withColon(protocol: string | null): string {
  if (!protocol) return '';
  return protocol.endsWith(':') ? protocol : `${protocol}:`;
}

export function parse(input: string): LegacyUrl {
  let url: URL | undefined;
  if (ABSOLUTE_URL.test(input)) {
    try {
      url = new URL(input);
    } catch {
      // unparsable absolute URL: fall through to plain-path parsing
    }
  }
  if (!url) {
    const hashAt = input.indexOf('#');
    const beforeHash = hashAt === -1 ? input : input.slice(0, hashAt);
    const searchAt = beforeHash.indexOf('?');
    const pathname = searchAt === -1 ? beforeHash : beforeHash.slice(0, searchAt);
    return {
      protocol: null,
      slashes: false,
      auth: null,
      host: null,
      hostname: null,
      port: null,
      pathname: pathname || null,
      search: searchAt === -1 ? null : beforeHash.slice(searchAt),
      hash: hashAt === -1 ? null : input.slice(hashAt),
      href: input,
      format() {
        return `${withColon(this.protocol)}${this.pathname ?? ''}${this.search ?? ''}${this.hash ?? ''}`;
      },
    };
  }
  let auth: string | null = null;
  if (url.username) auth = url.password ? `${url.username}:${url.password}` : url.username;
  const hostOnly = /^[a-z][a-z0-9+.-]*:\/\/[^/?#]+(?:[?#]|$)/i.test(input);
  const pathname = hostOnly ? '' : url.pathname;
  return {
    protocol: url.protocol,
    slashes: true,
    auth,
    host: url.host || null,
    hostname: url.hostname || null,
    port: url.port || null,
    pathname,
    search: url.search || null,
    hash: url.hash || null,
    href: url.href,
    format() {
      const auth = this.auth ? `${this.auth}@` : '';
      return `${withColon(this.protocol)}//${auth}${this.host ?? ''}${this.pathname}${this.search ?? ''}${this.hash ?? ''}`;
    },
  };
}

// Collapses `.` and `..` segments the way `url.resolve` does for relative paths.
function normalizeSegments(path: string): string {
  const out: string[] = [];
  for (const segment of path.split('/')) {
    if (segment === '.') continue;
    const last = out[out.length - 1];
    const atRoot = out.length === 1 && last === '';
    if (segment === '..' && atRoot) continue;
    if (segment === '..' && out.length > 0 && last !== '..') {
      out.pop();
    } else {
      out.push(segment);
    }
  }
  return out.join('/');
}

export function resolve(from: string, to: string): string {
  try {
    return new URL(to, from).toString();
  } catch {
    // relative `from`: legacy resolution over plain paths
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(to)) return to;
  if (from.startsWith('//')) {
    try {
      return new URL(to, `http:${from}`).toString().replace(/^http:/, '');
    } catch {
      // unparsable host: fall through to plain-path resolution
    }
  }
  if (to.startsWith('/')) return to;
  const tailAt = to.search(/[?#]/);
  const toPath = tailAt === -1 ? to : to.slice(0, tailAt);
  const tail = tailAt === -1 ? '' : to.slice(tailAt);
  if (!toPath)
    return from.replace(tail.startsWith('?') ? /(?<![?#])[?#].*$/ : /(?<!#)#.*$/, '') + tail;
  return normalizeSegments(from.replace(/(?<![^/])[^/]*$/, '') + toPath) + tail;
}

export function format(url: string | LegacyUrl): string {
  return typeof url === 'string' ? url : url.format();
}

export default { parse, resolve, format };
