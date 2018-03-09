const theme = {
  spacingUnit: 20,
  breakpoints: {
    small: '50rem',
    medium: '85rem',
    large: '105rem',
  },
  colors: {
    main: '#32329f',
    success: '#00aa13',
    redirect: 'orange',
    error: '#e53935',
    info: 'skyblue',
    text: '#263238',
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
    linesColor: '#7f99cf',
    defaultDetailsWidth: '75%',
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
    color: undefined, // by default main color
    visited: undefined, // by default main color
    hover: undefined, // by default main color
  },
  menu: {
    width: '260px',
    backgroundColor: '#fafafa',
  },
  logo: {
    maxHeight: 'none',
    width: '100%',
  },
  rightPanel: {
    backgroundColor: '#263238',
    width: 40,
  },
};

export default theme;

export type ThemeInterface = typeof theme;
