import { darken, lighten, readableColor, transparentize } from 'polished';
import { palette } from '@leafygreen-ui/palette';

const textFontFamily =
  '"Euclid Circular A", Akzidenz, "Helvetica Neue", Helvetica, Arial, sans-serif';
const codeFontFamily = 'Source Code Pro';

const defaultTheme: ThemeInterface = {
  spacing: {
    unit: 4,
    sectionHorizontal: ({ spacing }) => spacing.unit * 8,
    sectionVertical: 16,
  },
  breakpoints: {
    small: '768px',
    medium: '1024px',
    large: '1200px',
  },
  colors: {
    tonalOffset: 0.2,
    primary: {
      main: palette.black,
      light: ({ colors }) => lighten(colors.tonalOffset, colors.primary.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.primary.main),
      contrastText: ({ colors }) => readableColor(colors.primary.main),
    },
    success: {
      main: '#1d8127',
      light: ({ colors }) => lighten(colors.tonalOffset * 2, colors.success.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.success.main),
      contrastText: ({ colors }) => readableColor(colors.success.main),
    },
    warning: {
      main: palette.gray.light1,
      light: ({ colors }) => lighten(colors.tonalOffset, colors.warning.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.warning.main),
      contrastText: palette.gray.dark1,
    },
    error: {
      main: palette.red.base,
      light: ({ colors }) => lighten(colors.tonalOffset, colors.error.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.error.main),
      contrastText: ({ colors }) => readableColor(colors.error.main),
    },
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
    },
    text: {
      primary: palette.gray.dark3,
      secondary: ({ colors }) => lighten(colors.tonalOffset, colors.text.primary),
    },
    border: {
      dark: 'rgba(0,0,0, 0.1)',
      light: '#ffffff',
    },
    responses: {
      success: {
        color: palette.green.dark2,
        backgroundColor: palette.green.light3,
        tabTextColor: palette.green.base,
      },
      error: {
        color: palette.red.base,
        backgroundColor: palette.red.light3,
        tabTextColor: palette.red.base,
      },
      redirect: {
        color: ({ colors }) => colors.warning.main,
        backgroundColor: ({ colors }) => transparentize(0.9, colors.responses.redirect.color),
        tabTextColor: ({ colors }) => colors.responses.redirect.color,
      },
      info: {
        color: '#87ceeb',
        backgroundColor: ({ colors }) => transparentize(0.9, colors.responses.info.color),
        tabTextColor: ({ colors }) => colors.responses.info.color,
      },
    },
    http: {
      get: {
        light: {
          backgroundColor: palette.blue.light3,
          borderColor: palette.blue.light2,
          color: palette.blue.dark1,
        },
        dark: {
          backgroundColor: palette.blue.dark2,
          borderColor: palette.blue.dark1,
          color: palette.blue.light2,
        },
      },
      post: {
        light: {
          backgroundColor: palette.green.light3,
          borderColor: palette.green.light2,
          color: palette.green.dark2,
        },
        dark: {
          backgroundColor: palette.green.dark3,
          borderColor: palette.green.dark2,
          color: palette.green.base,
        },
      },
      put: {
        light: {
          backgroundColor: palette.yellow.light3,
          borderColor: palette.yellow.light2,
          color: palette.yellow.dark2,
        },
        dark: {
          backgroundColor: palette.yellow.dark3,
          borderColor: palette.yellow.dark2,
          color: palette.yellow.light2,
        },
      },
      options: '#947014',
      patch: {
        light: {
          backgroundColor: palette.yellow.light3,
          borderColor: palette.yellow.light2,
          color: palette.yellow.dark2,
        },
        dark: {
          backgroundColor: palette.yellow.dark3,
          borderColor: palette.yellow.dark2,
          color: palette.yellow.light2,
        },
      },
      delete: {
        light: {
          backgroundColor: palette.red.light3,
          borderColor: palette.red.light2,
          color: palette.red.dark2,
        },
        dark: {
          backgroundColor: palette.red.dark3,
          borderColor: palette.red.dark2,
          color: palette.red.light2,
        },
      },
      basic: '#707070',
      link: '#07818F',
      head: '#A23DAD',
    },
  },
  schema: {
    linesColor: palette.black,
    defaultDetailsWidth: '75%',
    typeNameColor: palette.gray.dark3,
    typeTitleColor: theme => theme.schema.typeNameColor,
    requireLabelColor: palette.red.base,
    labelsTextSize: '0.9em',
    nestingSpacing: '1em',
    nestedBackground: '#fafafa',
    arrow: {
      size: '1.1em',
      color: theme => theme.colors.text.secondary,
    },
  },
  typography: {
    fontSize: '16px',
    lineHeight: '1.5em',
    fontWeightRegular: '400',
    fontWeightBold: '600',
    fontWeightLight: '300',
    fontFamily: textFontFamily,
    smoothing: 'antialiased',
    optimizeSpeed: true,
    headings: {
      fontFamily: textFontFamily,
      fontWeight: '400',
      lineHeight: '1.6em',
    },
    code: {
      fontSize: '13px',
      fontFamily: codeFontFamily,
      lineHeight: ({ typography }) => typography.lineHeight,
      fontWeight: ({ typography }) => typography.fontWeightRegular,
      color: palette.gray.dark3,
      backgroundColor: palette.gray.light3,
      wrap: false,
    },
    links: {
      color: palette.blue.base,
      visited: palette.blue.base,
      hover: palette.blue.base,
      textDecoration: 'auto',
      hoverTextDecoration: 'auto',
    },
  },
  sidebar: {
    width: '268px',
    backgroundColor: palette.gray.light3,
    textColor: palette.black,
    activeTextColor: palette.green.dark3,
    groupItems: {
      activeBackgroundColor: palette.green.light3,
      activeTextColor: theme => theme.sidebar.activeTextColor,
      textTransform: 'uppercase',
    },
    level1Items: {
      activeBackgroundColor: palette.green.light3,
      activeTextColor: theme => theme.sidebar.activeTextColor,
      textTransform: 'none',
    },
    arrow: {
      size: '1.5em',
      color: theme => theme.sidebar.textColor,
    },
  },
  logo: {
    maxHeight: ({ sidebar }) => sidebar.width,
    maxWidth: ({ sidebar }) => sidebar.width,
    gutter: '2px',
  },
  rightPanel: {
    backgroundColor: palette.black,
    width: '40%',
    textColor: '#ffffff',
    servers: {
      overlay: {
        backgroundColor: palette.gray.dark3,
        textColor: palette.white,
      },
      url: {
        backgroundColor: palette.gray.dark3,
      },
    },
  },
  codeBlock: {
    backgroundColor: palette.gray.dark3,
  },
  fab: {
    backgroundColor: '#f2f2f2',
    color: '#0065FB',
  },
  badges: {
    border: '1px solid',
    borderRadius: '5px',
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
                  `Theme probably contains circular dependency at ${currentPath}: ${val.toString()}`,
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

export interface ColorSetting {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

export interface HTTPResponseColos {
  color: string;
  backgroundColor: string;
  tabTextColor: string;
}

export interface HTTPBadgeOptions {
  backgroundColor: string;
  borderColor: string;
  color: string;
}

export interface HTTPBadgeColors {
  light: HTTPBadgeOptions;
  dark: HTTPBadgeOptions;
}

export interface FontSettings {
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  lineHeight: string;
  color: string;
}

export interface Servers {
  overlay: {
    backgroundColor: string;
    textColor: string;
  };
  url: {
    backgroundColor: string;
  };
}

export interface ResolvedThemeInterface {
  spacing: {
    unit: number;
    sectionHorizontal: number;
    sectionVertical: number;
  };
  breakpoints: {
    small: string;
    medium: string;
    large: string;
  };
  colors: {
    tonalOffset: number;
    primary: ColorSetting;
    success: ColorSetting;
    warning: ColorSetting;
    error: ColorSetting;
    gray: {
      50: string;
      100: string;
    };
    border: {
      light: string;
      dark: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    responses: {
      success: HTTPResponseColos;
      error: HTTPResponseColos;
      redirect: HTTPResponseColos;
      info: HTTPResponseColos;
    };
    http: {
      get: HTTPBadgeColors;
      post: HTTPBadgeColors;
      put: HTTPBadgeColors;
      options: string;
      patch: HTTPBadgeColors;
      delete: HTTPBadgeColors;
      basic: string;
      link: string;
      head: string;
    };
  };
  schema: {
    linesColor: string;
    defaultDetailsWidth: string;
    typeNameColor: string;
    typeTitleColor: string;
    requireLabelColor: string;
    labelsTextSize: string;
    nestingSpacing: string;
    nestedBackground: string;
    arrow: {
      size: string;
      color: string;
    };
  };
  typography: {
    fontSize: string;
    lineHeight: string;
    fontWeightLight: string;
    fontWeightRegular: string;
    fontWeightBold: string;
    fontFamily: string;

    smoothing: string;
    optimizeSpeed: boolean;

    code: FontSettings & {
      backgroundColor: string;
      wrap: boolean;
    };
    headings: {
      fontFamily: string;
      fontWeight: string;
      lineHeight: string;
    };

    links: {
      color: string;
      visited: string;
      hover: string;
      textDecoration: string;
      hoverTextDecoration: string;
    };
  };
  sidebar: {
    width: string;
    backgroundColor: string;
    textColor: string;
    activeTextColor: string;
    groupItems: {
      activeBackgroundColor: string;
      activeTextColor: string;
      textTransform: string;
    };
    level1Items: {
      activeBackgroundColor: string;
      activeTextColor: string;
      textTransform: string;
    };
    arrow: {
      size: string;
      color: string;
    };
  };
  logo: {
    maxHeight: string;
    maxWidth: string;
    gutter: string;
  };
  rightPanel: {
    backgroundColor: string;
    textColor: string;
    width: string;
    servers: Servers;
  };
  codeBlock: {
    backgroundColor: string;
  };
  fab: {
    backgroundColor: string;
    color: string;
  };
  badges: {
    border: string;
    borderRadius: string;
  };

  extensionsHook?: (name: string, props: any) => string;
}

export type primitive = string | number | boolean | undefined | null;
export type AdvancedThemeDeep<T> = T extends primitive
  ? T | ((theme: ResolvedThemeInterface) => T)
  : AdvancedThemeObject<T>;
export type AdvancedThemeObject<T> = { [P in keyof T]?: AdvancedThemeDeep<T[P]> };
export type ThemeInterface = AdvancedThemeObject<ResolvedThemeInterface>;
