import * as Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

import 'raf/polyfill';

Enzyme.configure({ adapter: new Adapter() });
