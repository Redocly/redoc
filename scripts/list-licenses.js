import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

const jsonOutput = execSync('npm run license:check -- --json').toString();

const packages = JSON.parse(jsonOutput.split('\n').slice(4).join('\n'));

const res = {
  packageVersion: JSON.parse(readFileSync('../package.json', 'utf8')).version,
  packages: [],
};

for (let name of Object.keys(packages)) {
  if (name.startsWith('@redocly')) {
    continue;
  }

  const pkg = packages[name];

  if (!pkg.repository) {
    console.warn(`Unknown repository for package "${name}"`);
  }

  res.packages.push({
    name,
    license: packages[name].licenses,
    repository: packages[name].repository,
  });
}

writeFileSync('licenses-list.json', JSON.stringify(res, null, 2));
console.log('Saved to licenses-list.json');
