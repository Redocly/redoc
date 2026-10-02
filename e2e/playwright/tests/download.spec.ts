import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('Download', () => {
  test('OpenAPI: should render download links with attributes', async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await page.goto('/cafe');
    await apiDocs.waitForPageLoad();

    const yamlLink = apiDocs
      .getDownloadDescription('panel-download-openapi-description')
      .getByText('definition.yaml');
    await expect(yamlLink).toHaveAttribute('href');
    await expect(yamlLink).toHaveAttribute('download');

    const jsonLink = apiDocs
      .getDownloadDescription('panel-download-openapi-description')
      .getByText('definition.json');
    await expect(jsonLink).toHaveAttribute('href');
    await expect(jsonLink).toHaveAttribute('download');

    await expect(apiDocs.getDownloadDescription('panel-download-openapi-description'))
      .toMatchAriaSnapshot(`
      - link "definition.yaml"
      - link "definition.json"
    `);
  });

  test('GraphQL: should render download button and link', async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await page.goto('/');
    await apiDocs.waitForPageLoad();

    const graphqlLink = apiDocs
      .getDownloadDescription('panel-download-graphql-schema')
      .getByText('schema.graphql');
    await expect(graphqlLink).toBeVisible();
    await expect(graphqlLink).toHaveAttribute('href');
    await expect(graphqlLink).toHaveAttribute('download');
  });

  test('GraphQL: should download schema', async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await page.goto('/');
    await apiDocs.waitForPageLoad();

    const downloadPromise = page.waitForEvent('download');
    await apiDocs
      .getDownloadDescription('panel-download-graphql-schema')
      .getByText('schema.graphql')
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch('schema.docs.graphql');

    const stream = await download.createReadStream();
    expect(stream).toBeTruthy();
  });

  test('AsyncAPI: should render JSON and YAML download links', async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await page.goto('/asyncapi');
    await apiDocs.waitForPageLoad();

    const jsonLink = apiDocs
      .getDownloadDescription('panel-download-asyncapi-description')
      .getByText('asyncapi.json');
    await expect(jsonLink).toBeVisible();
    await expect(jsonLink).toHaveAttribute('href');
    await expect(jsonLink).toHaveAttribute('download');

    const yamlLink = apiDocs
      .getDownloadDescription('panel-download-asyncapi-description')
      .getByText('asyncapi.yaml');
    await expect(yamlLink).toBeVisible();
    await expect(yamlLink).toHaveAttribute('href');
    await expect(yamlLink).toHaveAttribute('download');
  });
});
