import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { loadAndBundleDefinition } from '../loadAndBundleSpec';

describe('#loadAndBundleDefinition', () => {
  it('should load and bundle spec petstore.yaml', async () => {
    const spec = yaml.load(
      readFileSync(resolve(__dirname, '../../../playground/openapi/petstore.yaml'), 'utf-8'),
    ) as GenericObject | string;
    const bundledSpec = await loadAndBundleDefinition(spec);
    expect(bundledSpec).toMatchSnapshot();
  });

  it('should load and bundle spec rebilly.yaml', async () => {
    const spec = yaml.load(
      readFileSync(resolve(__dirname, '../../../playground/openapi/rebilly.yaml'), 'utf-8'),
    ) as GenericObject | string;
    const bundledSpec = await loadAndBundleDefinition(spec);
    expect(bundledSpec).toMatchSnapshot();
  });

  it('should load And Bundle Spec openapi-3-1.yaml', async () => {
    const spec = yaml.load(
      readFileSync(resolve(__dirname, '../../../playground/openapi/openapi-3-1.yaml'), 'utf-8'),
    ) as GenericObject | string;
    const bundledSpec = await loadAndBundleDefinition(spec);
    expect(bundledSpec).toMatchSnapshot();
  });
});
