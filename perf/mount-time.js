const puppeteer = require('puppeteer');
const crypto = require('crypto');

async function run() {
  return await puppeteer
    .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    .then(async browser => {
      const page = await browser.newPage();
      let resolve;
      const prom = new Promise(_resolve => {
        resolve = _resolve;
      });
      page.on('console', obj => {
        if (obj && obj.timings) {
          resolve(obj);
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

function clearLine() {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}

const metrics = ['Total Time', 'Store Init Time', 'Render Time'];
const forEachMetric = fn => metrics.forEach(metric => fn(metric));

async function benchmark() {
  const N = 5;

  let sum = {};
  let max = {};
  let min = {};

  forEachMetric(metric => {
    sum[metric] = 0;
    max[metric] = 0;
    min[metric] = Number.MAX_SAFE_INTEGER;
  });

  for (let i = 0; i < N; i++) {
    const res = await run();
    forEachMetric(metric => {
      if (res[metric] > max[metric]) max[metric] = res[metric];
      if (res[metric] < min[metric]) min[metric] = res[metric];
      sum[metric] += res[metric];
    });
    clearLine();
    process.stdout.write(`Running: ${i + 1} of ${N}`);
  }
  clearLine();
  const average = {};
  forEachMetric(metric => {
    average[metric] = sum[metric] / N;
  });
  console.log('Completed ', N, 'runs');
  console.log('=======================');
  forEachMetric(metric => {
    console.log(`Average ${metric}: `, average[metric]);
    console.log(`Minimum ${metric}: `, min[metric]);
    console.log(`Maximum ${metric}: `, max[metric]);
    console.log();
  });
}

benchmark();
