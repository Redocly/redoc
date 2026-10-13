import { writeFileSync, readFileSync } from 'fs';

// written by the `bundled-licenses` plugin in vite.config.ts during `npm run license:check`
const LISTS_DIR = new URL('../node_modules/.cache/bundled-licenses/', import.meta.url);
const BUNDLES = ['redoc', 'redoc.standalone'];

const res = {
  packageVersion: JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
    .version,
  packages: [],
};

const seen = new Set();
for (const bundle of BUNDLES) {
  const packages = JSON.parse(readFileSync(new URL(`${bundle}.json`, LISTS_DIR), 'utf8'));
  for (const { name, version, license, repository } of packages) {
    if (name.startsWith('@redocly') || seen.has(`${name}@${version}`)) {
      continue;
    }
    seen.add(`${name}@${version}`);

    if (!repository) {
      console.warn(`Unknown repository for package "${name}"`);
    }

    res.packages.push({ name, license, repository });
  }
}

writeFileSync('licenses-list.json', JSON.stringify(res, null, 2));
console.log('Saved to licenses-list.json');
