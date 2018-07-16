import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import 'raf/polyfill';

Enzyme.configure({ adapter: new Adapter() });
