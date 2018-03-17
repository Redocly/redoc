import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Redoc, RedocProps } from '../src/components';

import { loadAndBundleSpec } from '../src/utils';

import { revisions } from './revisions/config';
import { configure } from 'mobx';

declare var Benchmark;

configure({
  isolateGlobalState: true,
});

const node = document.getElementById('example');

const renderRoot = (Component: typeof Redoc, props: RedocProps) =>
  render(<Component {...props} />, node!);

async function importRedocs() {
  return Promise.all(
    revisions.map(rev => {
      return import('./' + rev.path.substring(12) + '/redoc.lib.js');
    }),
  );
}

function startFullTime(redocs, resolvedSpec) {
  return new Promise(async resolve => {
    const suite = new Benchmark.Suite('Full time', {
      maxTime: 20,
      initCount: 2,
      onStart(event) {
        console.log('  ⏱️  ' + event.currentTarget.name);
      },
      onCycle(event) {
        console.log({ cycle: event.target });
      },
      onComplete() {
        console.log({ done: true });
        setTimeout(() => resolve(), 10);
      },
    });

    revisions.forEach((rev, idx) => {
      const redoc = redocs[idx];
      suite.add(rev.name, () => {
        const store = new redoc.AppStore(resolvedSpec, 'openapi.yaml');
        renderRoot(redoc.Redoc, { store });
        unmountComponentAtNode(node!);
      });
    });

    suite.run({ async: true });
  });
}

function startInitStore(redocs, resolvedSpec) {
  return new Promise(async resolve => {
    const suite = new Benchmark.Suite('Create Store Time', {
      maxTime: 20,
      initCount: 2,
      onStart(event) {
        console.log('  ⏱️  ' + event.currentTarget.name);
      },
      onCycle(event) {
        console.log({ cycle: event.target });
      },
      onComplete() {
        console.log({ done: true });
        setTimeout(() => resolve(), 10);
      },
    });

    revisions.forEach((rev, idx) => {
      const redoc = redocs[idx];
      suite.add(rev.name, () => {
        const store = new redoc.AppStore(resolvedSpec, 'openapi.yaml');
        store.dispose();
      });
    });

    suite.run({ async: true });
  });
}

function startRenderTime(redocs, resolvedSpec) {
  return new Promise(async resolve => {
    const suite = new Benchmark.Suite('Render time', {
      maxTime: 20,
      initCount: 2,
      onStart(event) {
        console.log('  ⏱️  ' + event.currentTarget.name);
      },
      onCycle(event) {
        console.log({ cycle: event.target });
        unmountComponentAtNode(node!);
      },
      onComplete() {
        console.log({ done: true });
        setTimeout(() => resolve(), 10);
      },
    });

    revisions.forEach((rev, idx) => {
      const redoc = redocs[idx];
      const store = new redoc.AppStore(resolvedSpec, 'openapi.yaml');
      suite.add(rev.name, () => {
        renderRoot(redoc.Redoc, { store });
      });
    });

    suite.run({ async: true });
  });
}

async function runBenchmarks() {
  const redocs: any[] = await importRedocs();
  const resolvedSpec = await loadAndBundleSpec('openapi.yaml');
  await startInitStore(redocs, resolvedSpec);
  await startRenderTime(redocs, resolvedSpec);
  await startFullTime(redocs, resolvedSpec);
  console.log({ allDone: true });
}

runBenchmarks();
