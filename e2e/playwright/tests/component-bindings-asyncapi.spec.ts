import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

const RIDE_REQUESTS = '/asyncapi/rides/topics/ride-requests';
const RIDE_MATCHES = '/asyncapi/rides/topics/ride-matches';
const PUBLISH_RIDE_REQUEST = `${RIDE_REQUESTS}/operations/publishriderequest`;

test.describe('AsyncAPI Kafka bindings', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test('should render the server bindings in the broker modal Configuration tab', async ({
    page,
  }) => {
    await goto(page, '/asyncapi');
    await apiDocs.waitForPageLoad();
    await apiDocs.openBrokerModal('production');
    await apiDocs.brokerModalTab('Configuration').click();

    const bindings = apiDocs.getBrokerBindingsSection();
    await expect(bindings.locator('[data-testid="schema-registry-url-label"]')).toHaveText(
      'Schema Registry URL:',
    );
    const registryLink = bindings.locator('[data-testid="external-documentation"] a');
    await expect(registryLink).toHaveText('https://registry.wheelyfast.io');
    await expect(registryLink).toHaveAttribute('href', 'https://registry.wheelyfast.io');
    await expect(bindings.locator('[data-testid="schema-registry-vendor-label"]')).toHaveText(
      'Schema Registry Vendor:',
    );
    await expect(bindings.locator('[data-testid="schema-registry-vendor-value"]')).toHaveText(
      'confluent',
    );
  });

  test('should render the channel bindings in the Topic configuration panel', async ({ page }) => {
    await goto(page, RIDE_REQUESTS);
    await apiDocs.waitForChannelLoad('Ride Requests Topic');

    const panel = apiDocs.bindingPanel(RIDE_REQUESTS, 'Topic configuration');
    await expect(apiDocs.bindingRowValue(panel, 'Topic')).toHaveText('ride-requests-{region}');
    await expect(apiDocs.bindingRowValue(panel, 'Partitions')).toHaveText('10');
    await expect(apiDocs.bindingRowValue(panel, 'Replicas')).toHaveText('3');
  });

  test('should expand the advanced topic configuration behind "More details"', async ({ page }) => {
    await goto(page, RIDE_REQUESTS);
    await apiDocs.waitForChannelLoad('Ride Requests Topic');

    const panel = apiDocs.bindingPanel(RIDE_REQUESTS, 'Topic configuration');
    await expect(panel).toBeVisible();
    await expect(panel.getByText('Cleanup policy')).toHaveCount(0);

    await panel.getByText('More details', { exact: true }).click();

    await expect(panel.getByText('Cleanup policy')).toBeVisible();
    await expect(panel.getByText('delete', { exact: true })).toBeVisible();
    await expect(panel.getByText('Retention, ms', { exact: true })).toBeVisible();
    await expect(panel.getByText('604800000')).toBeVisible();
  });

  test('should render the message bindings for the selected message', async ({ page }) => {
    await goto(page, RIDE_REQUESTS);
    await apiDocs.waitForChannelLoad('Ride Requests Topic');

    const panel = apiDocs.bindingPanel(RIDE_REQUESTS, 'Message configuration');
    await expect(panel.locator('.schema-name', { hasText: /^key$/ })).toBeVisible();
    await expect(panel.getByText('Passenger ID')).toBeVisible();
    await expect(apiDocs.bindingRowValue(panel, 'Schema ID Location')).toHaveText('value');
    await expect(apiDocs.bindingRowValue(panel, 'Schema ID payload encoding')).toHaveText(
      'confluent',
    );
  });

  test('should render the operation bindings as schema fields with their defaults', async ({
    page,
  }) => {
    await goto(page, PUBLISH_RIDE_REQUEST);
    await apiDocs.waitForPageLoad();

    const panel = apiDocs.bindingPanel(PUBLISH_RIDE_REQUEST, 'Operation configuration');
    await expect(panel).toBeVisible();

    await expect(panel.locator('.schema-name', { hasText: /^groupId$/ })).toBeVisible();
    await expect(panel.getByText('"ride-request-producer"')).toBeVisible();
    await expect(panel.locator('.schema-name', { hasText: /^clientId$/ })).toBeVisible();
    await expect(panel.getByText('"passenger-app"')).toBeVisible();
  });

  test('should show each channel its own bindings when navigating in-app', async ({ page }) => {
    await goto(page, RIDE_REQUESTS);
    await apiDocs.waitForChannelLoad('Ride Requests Topic');

    const rideRequestsPanel = apiDocs.bindingPanel(RIDE_REQUESTS, 'Topic configuration');
    await expect(apiDocs.bindingRowValue(rideRequestsPanel, 'Partitions')).toHaveText('10');

    await apiDocs.clickThroughMenu('Ride Matching Topic');
    await apiDocs.waitForChannelLoad('Ride Matching Topic');

    const rideMatchesPanel = apiDocs.bindingPanel(RIDE_MATCHES, 'Topic configuration');
    await expect(apiDocs.bindingRowValue(rideMatchesPanel, 'Topic')).toHaveText(
      'ride-matches-{region}',
    );
    await expect(apiDocs.bindingRowValue(rideMatchesPanel, 'Partitions')).toHaveText('8');
  });

  test('should keep the binding values after navigating away and back', async ({ page }) => {
    await goto(page, RIDE_REQUESTS);
    await apiDocs.waitForChannelLoad('Ride Requests Topic');

    await apiDocs.clickThroughMenu('Ride Matching Topic');
    await apiDocs.waitForChannelLoad('Ride Matching Topic');
    await apiDocs.clickThroughMenu('Ride Requests Topic');
    await apiDocs.waitForChannelLoad('Ride Requests Topic');

    const panel = apiDocs.bindingPanel(RIDE_REQUESTS, 'Topic configuration');
    await expect(apiDocs.bindingRowValue(panel, 'Topic')).toHaveText('ride-requests-{region}');
    await expect(apiDocs.bindingRowValue(panel, 'Partitions')).toHaveText('10');
    await expect(apiDocs.bindingRowValue(panel, 'Replicas')).toHaveText('3');
  });
});
