import { adjustHue, desaturate, lighten, transparentize } from 'polished';

const defaultTheme: ThemeInterface = {
  spacingUnit: 20,
  breakpoints: {
    small: '50rem',
    medium: '85rem',
    large: '105rem',
  },
  colors: {
    main: '#32329f',
    success: '#00aa13',
    redirect: '#ffa500',
    error: '#e53935',
    info: '#87ceeb',
    text: '#263238',
    code: '#e53935',
    codeBg: 'rgba(38, 50, 56, 0.04)',
    warning: '#f1c400',
    http: {
      get: '#6bbd5b',
      post: '#248fb2',
      put: '#9b708b',
      options: '#d3ca12',
      patch: '#e09d43',
      delete: '#e27a7a',
      basic: '#999',
      link: '#31bbb6',
    },
  },
  schemaView: {
    linesColor: theme => lighten(0.25, desaturate(0.35, theme.colors.main)),
    defaultDetailsWidth: '75%',
    typeNameColor: theme => transparentize(0.2, theme.colors.text),
    typeTitleColor: theme => theme.schemaView.typeNameColor,
    requireLabelColor: theme => theme.colors.error,
    nestingSpacing: '1em',
  },
  baseFont: {
    size: '14px',
    lineHeight: '1.5',
    weight: '300',
    family: 'Roboto, sans-serif',
    smoothing: 'antialiased',
    optimizeSpeed: true,
  },
  headingsFont: {
    family: 'Montserrat, sans-serif',
  },
  code: {
    fontSize: '13px',
    fontFamily: 'Courier, monospace',
  },
  links: {
    color: ({ colors }) => colors.main,
    visited: ({ colors }) => colors.main,
    hover: ({ colors }) => lighten(0.2, colors.main),
  },
  menu: {
    width: '260px',
    backgroundColor: '#fafafa',
  },
  logo: {
    maxHeight: ({ menu }) => menu.width,
    maxWidth: ({ menu }) => menu.width,
  },
  rightPanel: {
    backgroundColor: '#263238',
    width: '40%',
  },
};

export default defaultTheme;

export function resolveTheme(theme: ThemeInterface): ResolvedThemeInterface {
  const resolvedValues = {};
  let counter = 0;
  const setProxy = (obj, path: string) => {
    Object.keys(obj).forEach(k => {
      const currentPath = (path ? path + '.' : '') + k;
      const val = obj[k];
      if (typeof val === 'function') {
        Object.defineProperty(obj, k, {
          get() {
            if (!resolvedValues[currentPath]) {
              counter++;
              if (counter > 1000) {
                throw new Error(
                  `Theme probably contains cirucal dependency at ${currentPath}: ${val.toString()}`,
                );
              }

              resolvedValues[currentPath] = val(theme);
            }
            return resolvedValues[currentPath];
          },
          enumerable: true,
        });
      } else if (typeof val === 'object') {
        setProxy(val, currentPath);
      }
    });
  };

  setProxy(theme, '');
  return JSON.parse(JSON.stringify(theme));
}

export interface ResolvedThemeInterface {
  spacingUnit: number;
  breakpoints: {
    small: string;
    medium: string;
    large: string;
  };
  colors: {
    main: string;
    success: string;
    redirect: string;
    error: string;
    info: string;
    text: string;
    code: string;
    codeBg: string;
    warning: string;
    http: {
      get: string;
      post: string;
      put: string;
      options: string;
      patch: string;
      delete: string;
      basic: string;
      link: string;
    };
  };
  schemaView: {
    linesColor: string;
    defaultDetailsWidth: string;
    typeNameColor: string;
    typeTitleColor: string;
    requireLabelColor: string;
    nestingSpacing: string;
  };
  baseFont: {
    size: string;
    lineHeight: string;
    weight: string;
    family: string;
    smoothing: string;
    optimizeSpeed: boolean;
  };
  headingsFont: {
    family: string;
  };
  code: {
    fontSize: string;
    fontFamily: string;
  };
  links: {
    color: string;
    visited: string;
    hover: string;
  };
  menu: {
    width: string;
    backgroundColor: string;
  };
  logo: {
    maxHeight: string;
    maxWidth: string;
  };
  rightPanel: {
    backgroundColor: string;
    width: string;
  };
}

export type primitive = string | number | boolean | undefined | null;
export type AdvancedThemeDeep<T> = T extends primitive
  ? T | ((theme: ResolvedThemeInterface) => T)
  : AdvancedThemeObject<T>;
export type AdvancedThemeObject<T> = { [P in keyof T]?: AdvancedThemeDeep<T[P]> };
export type ThemeInterface = AdvancedThemeObject<ResolvedThemeInterface>;
