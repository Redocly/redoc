import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { loadAndBundleSpec } from '../loadAndBundleSpec';

describe('#loadAndBundleSpec', () => {
  it('should load And Bundle Spec demo/openapi.yaml', async () => {
    const spec = yaml.load(readFileSync(resolve(__dirname, '../../../demo/openapi.yaml'), 'utf-8'));
    const bundledSpec = await loadAndBundleSpec(spec);
    expect(bundledSpec).toMatchSnapshot();
  });

  it('should load And Bundle Spec demo/openapi-3-1.yaml', async () => {
    const spec = yaml.load(
      readFileSync(resolve(__dirname, '../../../demo/openapi-3-1.yaml'), 'utf-8'),
    );
    const bundledSpec = await loadAndBundleSpec(spec);
    expect(bundledSpec).toMatchSnapshot();
  });

  it('should load And Bundle Spec demo/swagger.yaml', async () => {
    const spec = yaml.load(readFileSync(resolve(__dirname, '../../../demo/swagger.yaml'), 'utf-8'));
    const bundledSpec = await loadAndBundleSpec(spec);
    expect(bundledSpec).toMatchSnapshot();
  });
});
