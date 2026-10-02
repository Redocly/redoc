import { readFileSync } from 'fs';

console.log(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version);
