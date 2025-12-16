import { cryptoLib } from './utils.js';

type CryptoOperation<T> = { oncomplete: (e: { target: { result: T } }) => void };

function promisifyIECryptoRes<T>(res: PromiseLike<T> | CryptoOperation<T>): PromiseLike<T> {
  if ('then' in res) {
    return res as PromiseLike<T>;
  } else {
    return new Promise<T>((resolve) => {
      res.oncomplete = (e) => {
        resolve(e.target.result);
      };
    });
  }
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

const getKey = () => {
  const publickeyDer = str2ab(
    atob(
      typeof REDOCLY_PUBLIC_KEY !== 'undefined'
        ? REDOCLY_PUBLIC_KEY
        : 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMHjNir5fXx/ZXoaEeXQ5XyxbNJ4YJYczoCRdSkL6NLzw1FHnng5Vfcgk5+bvox9QRYRbuk84mA4f2NhywDbXKECAwEAAQ==',
    ),
  );
  return promisifyIECryptoRes(
    (cryptoLib as Crypto)?.subtle.importKey(
      'spki',
      publickeyDer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      true,
      ['verify'],
    ),
  );
};

function textEncode(str) {
  if (window.TextEncoder) {
    return new TextEncoder().encode(str);
  }
  const utf8 = unescape(encodeURIComponent(str));
  const result = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) {
    result[i] = utf8.charCodeAt(i);
  }
  return result;
}

async function verify(message, signature) {
  return promisifyIECryptoRes(
    (cryptoLib as Crypto)?.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      await getKey(),
      str2ab(atob(signature)),
      textEncode(message),
    ),
  );
}

export type LicenseInfo = {
  t?: boolean; // trial ?
  i?: number; // issued at
  e?: number; // expires
  h?: string[] | true; // hosts allowed; true means all hosts

  valid?: boolean; // signature valid
  expired?: boolean; // is expired
  allowed?: boolean; // is host allowed
  local?: boolean;
  cryptoMissing?: boolean;
};

export function isHostAllowed(hostname: string, hosts: string[] | boolean | undefined): boolean {
  if (hosts === true) return true;

  if (Array.isArray(hosts) && typeof window !== 'undefined') {
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.localhost') ||
      !!hosts.find((h) => h === hostname || hostname.endsWith('.' + h))
    ) {
      return true;
    }

    return !!hosts.find((h) => {
      if (h.indexOf('*') !== h.lastIndexOf('*')) return;
      const [leftPart, rightPart] = h.split('*');
      return (
        rightPart &&
        hostname.startsWith(leftPart) &&
        hostname.endsWith(rightPart) &&
        rightPart.split('.').length > 2
      );
    });
  }

  return false;
}

export default async function parse(key?: string): Promise<LicenseInfo> {
  if (process.env.NODE_ENV === 'development') {
    return {
      valid: true,
      allowed: true,
    };
  }

  const hostname = window.location.hostname;

  if (!key) {
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
      return {
        local: true,
      };
    } else {
      return {};
    }
  }

  const [token, signature] = key.split('.');
  let info: LicenseInfo;
  try {
    if (!(await verify(atob(token), signature))) {
      return { valid: false };
    }
    info = JSON.parse(atob(token));
  } catch {
    return { valid: false, cryptoMissing: true };
  }

  info.valid = true;

  if (!info.e || Date.now() / 1000 > info.e) {
    info.expired = true;
  }

  info.allowed = isHostAllowed(hostname, info.h);

  return info;
}
