import { test, expect } from '@playwright/test';

import type { Page } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

function expectTextPresent(page: Page, text: string) {
  return expect(page.getByText(text).first()).toBeAttached();
}

test.describe('OpenAPI 3.2 Features - dataValue and serializedValue', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/openapi-3-2');
  });

  test.describe('Request Body Examples', () => {
    test('should render JSON example with value field', async ({ page }) => {
      await apiDocs.clickThroughMenu('Request Body Examples', 'JSON with value field');

      await expectTextPresent(page, 'user-value-123');
      await expectTextPresent(page, 'Alice Johnson');
      await expectTextPresent(page, 'alice@example.com');
    });

    test('should render JSON example with dataValue field', async ({ page }) => {
      await apiDocs.clickThroughMenu('Request Body Examples', 'JSON with dataValue field');

      await expectTextPresent(page, 'user-datavalue-456');
      await expectTextPresent(page, 'Bob Smith');
      await expectTextPresent(page, 'bob@example.com');
    });

    test('should render JSON example with serializedValue field', async ({ page }) => {
      await apiDocs.clickThroughMenu('Request Body Examples', 'JSON with serializedValue field');

      await expectTextPresent(page, 'user-serialized-789');
      await expectTextPresent(page, 'Charlie Brown');
      await expectTextPresent(page, 'charlie@example.com');
    });

    test('should render XML example with dataValue field', async ({ page }) => {
      await apiDocs.clickThroughMenu('Request Body Examples', 'XML with dataValue field');

      await expectTextPresent(page, 'user-xml-123');
      await expectTextPresent(page, 'David Wilson');
      await expectTextPresent(page, 'david@example.com');
    });

    test('should render XML example with serializedValue field', async ({ page }) => {
      await apiDocs.clickThroughMenu('Request Body Examples', 'XML with serializedValue field');

      await expectTextPresent(page, 'user-xml-serialized-456');
      await expectTextPresent(page, 'Eve Martinez');
      await expectTextPresent(page, 'eve@example.com');
    });

    test('should render form-urlencoded example with dataValue field', async ({ page }) => {
      await apiDocs.clickThroughMenu('Request Body Examples', 'URL-encoded with dataValue field');

      await expectTextPresent(page, 'user-form-789');
      await expectTextPresent(page, 'Frank');
    });

    test('should render form-urlencoded example with serializedValue field', async ({ page }) => {
      await apiDocs.clickThroughMenu(
        'Request Body Examples',
        'URL-encoded with serializedValue field',
      );

      await expectTextPresent(page, 'user-form-serialized-999');
      await expectTextPresent(page, 'Grace');
    });
  });

  test.describe('Parameter Examples', () => {
    test('should render path parameter examples with dataValue and serializedValue', async ({
      page,
    }) => {
      await apiDocs.clickThroughMenu(
        'Parameter Examples',
        'Path parameter with dataValue and serializedValue',
      );

      await expectTextPresent(page, 'user-12345');
      await expectTextPresent(page, 'userId');
    });

    test('should render query parameter examples with dataValue and serializedValue', async ({
      page,
    }) => {
      await apiDocs.clickThroughMenu(
        'Parameter Examples',
        'Query parameter with dataValue and serializedValue',
      );

      await expectTextPresent(page, 'filter');
      await expectTextPresent(page, 'premium');
    });

    test('should render header parameter examples with dataValue and serializedValue', async ({
      page,
    }) => {
      await apiDocs.clickThroughMenu(
        'Parameter Examples',
        'Header parameter with dataValue and serializedValue',
      );

      await expectTextPresent(page, 'X-API-Key');
      await expectTextPresent(page, 'sk_live_abcdef123456');
    });

    test('should render cookie parameter examples with dataValue and serializedValue', async ({
      page,
    }) => {
      await apiDocs.clickThroughMenu(
        'Parameter Examples',
        'Cookie parameter with dataValue and serializedValue',
      );

      await expectTextPresent(page, 'sessionId');
      await expectTextPresent(page, 'session_abc123');
    });
  });

  test.describe('Response Headers Examples', () => {
    test('should render response header examples with dataValue and serializedValue', async ({
      page,
    }) => {
      await apiDocs.clickThroughMenu(
        'Response Headers Examples',
        'Response headers with dataValue and serializedValue',
      );

      await expectTextPresent(page, 'X-Rate-Limit');
      await expectTextPresent(page, '1000');
      await expectTextPresent(page, 'X-Request-Id');
      await expectTextPresent(page, 'req-abc123');
    });
  });

  test.describe('OpenAPI 3.2 Spec Examples', () => {
    test('should render examples from OpenAPI 3.2 specification', async ({ page }) => {
      await apiDocs.clickThroughMenu(
        'OpenAPI 3.2 Spec Examples',
        'OpenAPI 3.2 specification examples',
      );

      await expectTextPresent(page, 'Edsger Dijkstra');
      await expectTextPresent(page, 'edijkstra');
      await expectTextPresent(page, 'Unicode Name');
    });
  });
});
