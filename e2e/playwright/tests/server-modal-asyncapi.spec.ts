import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('Broker server modal', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await goto(page, '/asyncapi');
    await apiDocs.waitForPageLoad();
    await expect(apiDocs.brokerRow('production')).toBeVisible();
  });

  test('should open the modal from the broker "More details" button', async () => {
    await apiDocs.openBrokerModal('production');

    const modal = apiDocs.getBrokerModal();
    await expect(modal).toContainText('kafka');
    await expect(modal).toContainText('production');
  });

  test('should show the server details in the Overview section', async () => {
    await apiDocs.openBrokerModal('production');

    const overview = apiDocs.getBrokerOverviewSection();
    await expect(overview.getByText('kafka.wheelyfast.io:9092')).toBeVisible();
    await expect(overview.getByText('kafka, 2.6.0')).toBeVisible();
    await expect(overview.getByText('Production WheelyFast Kafka Brokers')).toBeVisible();
    await expect(
      overview.getByText('Main production messaging brokers for the WheelyFast platform'),
    ).toBeVisible();
    await expect(overview.getByText('Production Kafka broker cluster')).toBeVisible();

    await expect(overview.getByText('region', { exact: true })).toBeVisible();
    await expect(overview.getByText('environment', { exact: true })).toBeVisible();
    await expect(overview.getByText('us-east-1').first()).toBeVisible();
  });

  test('should show the kafka protocol icon in the modal title', async () => {
    await apiDocs.openBrokerModal('production');

    await expect(apiDocs.getBrokerModal().getByTestId('icons/KafkaIcon/KafkaIcon')).toBeVisible();
  });

  test('should switch between the Overview and Configuration sections', async () => {
    await apiDocs.openBrokerModal('production');
    await expect(apiDocs.getBrokerOverviewSection()).toBeVisible();

    const configurationTab = apiDocs.brokerModalTab('Configuration');
    await expect(configurationTab).toBeVisible();

    await configurationTab.click();
    await expect(apiDocs.getBrokerBindingsSection()).toBeVisible();
    await expect(apiDocs.getBrokerOverviewSection()).toHaveCount(0);

    await apiDocs.brokerModalTab('Overview').click();
    await expect(apiDocs.getBrokerOverviewSection()).toBeVisible();
    await expect(apiDocs.getBrokerBindingsSection()).toHaveCount(0);
  });

  test('should close the modal with the close button', async () => {
    await apiDocs.openBrokerModal('production');

    await apiDocs.closeBrokerModal();
    await expect(apiDocs.getBrokerModal()).toHaveCount(0);
  });
});
