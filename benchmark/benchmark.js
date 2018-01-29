const beautifyBenchmark = require('beautify-benchmark');
const sh = require('shelljs');
const fs = require('fs');
const pathJoin = require('path').join;
const spawn = require('child_process').spawn;
const puppeteer = require('puppeteer');

const args = process.argv.slice(2);
args[0] = args[0] || 'HEAD';
args[1] = args[1] || 'local';

console.log('Benchmarking revisions: ' + args.join(', '));

const localDistDir = './benchmark/revisions/local/bundles';
sh.rm('-rf', localDistDir);
console.log(`Building local dist: ${localDistDir}`);
sh.mkdir('-p', localDistDir);
exec(`yarn bundle:lib --output-path ${localDistDir}`);

const revisions = [];
for (const arg of args) {
  revisions.push({ name: arg, path: buildRevisionDist(arg) });
}

const configFile = `
  export const revisions = [ ${revisions.map(rev => JSON.stringify(rev)).join(', ')} ];
`;

const configDir = './benchmark/revisions/config.js';
console.log(`Writing config "${configDir}"`);
fs.writeFileSync(configDir, configFile);

console.log('Starging benchmark server');
const proc = spawn('npm', ['run', 'start:benchmark']);

proc.stdout.on('data', data => {
  if (data.toString().indexOf('Project is running at') > -1) {
    console.log('Server started');
    startBenchmark();
  }
});

proc.stderr.on('data', data => {
  console.error(data.toString());
});

proc.on('close', code => {
  console.log(`Benchmark server stopped with code ${code}`);
});

async function runPuppeteer() {
  return await puppeteer
    .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    .then(async browser => {
      const page = await browser.newPage();
      let resolve;
      const prom = new Promise(_resolve => {
        resolve = _resolve;
      });
      page.on('console', obj => {
        if (!obj) return;

        if (obj.done) {
          beautifyBenchmark.log();
          // resolve(obj);
        } else if (obj.cycle) {
          beautifyBenchmark.add(obj.cycle);
        } else if (obj.allDone) {
          resolve();
        } else {
          console.log(obj);
        }
      });
      await page.goto('http://localhost:9090', {
        waitUntil: 'networkidle',
      });
      const res = await prom;
      await browser.close();
      return res;
    });
}

async function startBenchmark() {
  console.log('Starting benchmarks');
  await runPuppeteer();

  console.log('Killing benchmark server');
  proc.kill('SIGINT');
}

function exec(command) {
  const { code, stdout, stderr } = sh.exec(command, { silent: true });
  if (code !== 0) {
    console.error(stdout);
    console.error(stderr);
    sh.exit(code);
  }
  return stdout.trim();
}

function buildRevisionDist(revision) {
  if (revision === 'local') {
    return localDistDir;
  }
  const hash = exec(`git log -1 --format=%h "${revision}"`);
  const buildDir = './benchmark/revisions/' + hash;
  const distDir = buildDir + '/bundles';
  if (sh.test('-d', distDir)) {
    console.log(`Using prebuilt "${revision}"(${hash}) revision: ${buildDir}`);
    return distDir;
  }
  console.log(`Building "${revision}"(${hash}) revision: ${buildDir}`);
  sh.mkdir('-p', buildDir);
  exec(`git archive "${hash}" | tar -xC "${buildDir}"`);

  const pwd = sh.pwd();
  sh.cd(buildDir);
  exec('yarn remove cypress puppeteer && yarn && yarn bundle:lib');
  sh.cd(pwd);
  return distDir;
}
