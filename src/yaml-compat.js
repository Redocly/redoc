// swagger2openapi's `yaml@1` dependency, served by the js-yaml already in the bundle.
import { dump, load } from 'js-yaml';

export const parse = (str) => load(str);
export const stringify = (obj) => dump(obj);
export default { parse, stringify };
