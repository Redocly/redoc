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
      page.on('console', (obj) => {
        if (obj && obj.time) {
          resolve(obj.time);
        }
      });
      await page.goto('http://localhost:9090', {
        waitUntil: 'networkidle',
      });
      const res = await prom;
      await browser.close()
      return res;
    });
}

function clearLine() {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}

async function benchmark() {
  const N = 5;
  let sum = 0;
  let max = 0;
  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < N; i++) {
    const res = await run();
    if (res > max) max = res;
    if (res < min) min = res;
    sum += res;
    clearLine();
    process.stdout.write(`Running: ${i + 1} of ${N}`);
  }
  clearLine();
  const average = sum / N;
  console.log('Completed ', N, 'runs');
  console.log('=======================');
  console.log('Average Render Time: ', average);
  console.log('Minimum Render Time: ', min);
  console.log('Maximum Render Time: ', max);
}

benchmark();
