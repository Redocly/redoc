import * as yaml from 'yaml-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { loadAndBundleSpec } from '../loadAndBundleSpec';

describe('#loadAndBundleSpec', () => {
  it('should load And Bundle Spec demo/openapi.yaml', async () => {
    const spec = yaml.load(readFileSync(resolve(__dirname, '../../../demo/openapi.yaml')));
    const bundledSpec = await loadAndBundleSpec(spec);
    expect(bundledSpec).toMatchSnapshot();
  });

  it('should load And Bundle Spec demo/swagger.yaml', async () => {
    const spec = yaml.load(readFileSync(resolve(__dirname, '../../../demo/swagger.yaml')));
    const bundledSpec = await loadAndBundleSpec(spec);
    expect(bundledSpec).toMatchSnapshot();
  });
});
