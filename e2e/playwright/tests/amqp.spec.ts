import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

const BASE = '/asyncapi-amqp';
const EXCHANGE_PATH = `${BASE}/orders/exchs/orderPlacedExchange`;
const QUEUE_PATH = `${BASE}/orders/queues/fulfillmentQueue`;

test.describe('AsyncAPI AMQP rendering', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test.describe('Protocol tags (#3)', () => {
    test('routingKey channel page renders an Exchange protocol tag and heading', async ({
      page,
    }) => {
      await page.goto(EXCHANGE_PATH);
      await apiDocs.waitForPageLoad();

      await expect(
        page.getByRole('heading', { level: 2, name: 'Order Placed Exchange' }),
      ).toBeVisible();
      await expect(page.locator('text=/^Exchange$/').first()).toBeVisible();
    });

    test('queue channel page renders a Queue protocol tag and heading', async ({ page }) => {
      await page.goto(QUEUE_PATH);
      await apiDocs.waitForPageLoad();

      await expect(
        page.getByRole('heading', { level: 2, name: 'Fulfillment Queue' }),
      ).toBeVisible();
      await expect(page.locator('text=/^Queue$/').first()).toBeVisible();
    });

    test('publish operation renders a Pub action tag', async ({ page }) => {
      await page.goto(`${EXCHANGE_PATH}/operations/publishOrderPlaced`);
      await apiDocs.waitForPageLoad();

      await expect(
        page.getByRole('heading', { level: 5, name: 'Publish Order Placed' }),
      ).toBeVisible();
      await expect(page.locator('text=/^Pub$/').first()).toBeVisible();
    });


    test('receive operation renders a Cons action tag', async ({ page }) => {
      await page.goto(`${QUEUE_PATH}/operations/consumeOrderPlacedForFulfillment`);
      await apiDocs.waitForPageLoad();

      await expect(
        page.getByRole('heading', { level: 5, name: 'Consume Order Placed (fulfillment)' }),
      ).toBeVisible();
      await expect(page.locator('text=/^Cons$/').first()).toBeVisible();
    });
  });

  test.describe('MessageReferencesPanel (#2)', () => {
    test('renders an "Used in ..." panel listing every channel that uses the message', async ({
      page,
    }) => {
      await page.goto(EXCHANGE_PATH);
      await apiDocs.waitForPageLoad();

      const panel = page
        .locator('[data-section-id="/asyncapi-amqp/orders/exchs/orderplacedexchange"]')
        .locator('[data-testid="panel-used-in-1-exchange-and-2-queues"]');
      await expect(panel).toBeVisible();

      await expect(panel.getByText('Exchanges', { exact: true })).toBeVisible();
      await expect(panel.getByRole('link', { name: 'Order Placed Exchange' })).toBeVisible();

      await expect(panel.getByText('Queues', { exact: true })).toBeVisible();
      await expect(panel.getByRole('link', { name: 'Fulfillment Queue' })).toBeVisible();
      await expect(panel.getByRole('link', { name: 'Analytics Queue' })).toBeVisible();
    });

    test('clicking a queue reference navigates to that channel page', async ({ page }) => {
      await page.goto(EXCHANGE_PATH);
      await apiDocs.waitForPageLoad();

      const panel = page
        .locator('[data-section-id="/asyncapi-amqp/orders/exchs/orderplacedexchange"]')
        .locator('[data-testid="panel-used-in-1-exchange-and-2-queues"]');
      await expect(panel).toBeVisible();

      await panel.getByRole('link', { name: 'Analytics Queue' }).click();

      await expect(page.getByRole('heading', { level: 2, name: 'Analytics Queue' })).toBeVisible();
      expect(page.url()).toContain(`${BASE}/orders/queues/analyticsqueue`);
    });
  });
});
