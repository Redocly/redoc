import { readFileSync } from 'fs';

console.log(JSON.parse(readFileSync('../package.json', 'utf8')).version);
