import * as Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  __REDOC_VERSION__: 'test',
  __REDOC_REVISION__: 'test',
});

import 'raf/polyfill';

Enzyme.configure({ adapter: new Adapter() });
