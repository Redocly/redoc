import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('AsyncAPI Documentation', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await goto(page, '/asyncapi');
    await apiDocs.waitForPageLoad();
  });

  test('should render the API title, description and info panel', async ({ page }) => {
    const heading = apiDocs.getApiTitleHeading();
    await expect(heading).toContainText('WheelyFast - Ride Sharing Platform');
    await expect(heading).toContainText('1.0.0');

    await expect(
      page.getByText('WheelyFast is a real-time ride sharing service').first(),
    ).toBeVisible();

    const overview = apiDocs.getOverview();
    await expect(overview.getByText('api@wheelyfast.io')).toBeVisible();
    await expect(overview.getByText('Apache 2.0')).toBeVisible();
    await expect(overview.getByText('Terms of Service')).toBeVisible();
  });

  test('should navigate from the sidebar menu to a channel page', async ({ page }) => {
    await apiDocs.clickThroughMenu('Rides', 'Ride Requests Topic');

    await expect(page).toHaveURL(/\/asyncapi\/rides\/topics\/ride-requests\/?$/);
    await apiDocs.waitForChannelLoad('Ride Requests Topic');
    await expect(apiDocs.sectionById('/asyncapi/rides/topics/ride-requests')).toBeVisible();
  });

  test('should display the channel details on a topic page', async ({ page }) => {
    await goto(page, '/asyncapi/rides/topics/ride-requests');
    await apiDocs.waitForChannelLoad('Ride Requests Topic');

    const channel = apiDocs.sectionById('/asyncapi/rides/topics/ride-requests');
    await expect(
      channel.getByText('Stream of passenger ride requests and cancellations events'),
    ).toBeVisible();
    await expect(channel.getByRole('heading', { name: 'Parameters' })).toBeVisible();
    await expect(channel.locator('.schema-name', { hasText: /^region$/ })).toBeVisible();
  });

  test('should display an untagged channel with its messages', async ({ page }) => {
    await goto(page, '/asyncapi/topics/driver-location');
    await apiDocs.waitForChannelLoad('Driver Location Topic');

    const channel = apiDocs.sectionById('/asyncapi/topics/driver-location');
    await expect(
      channel.getByText('Real-time event stream of driver location coordinates'),
    ).toBeVisible();
    await expect(channel.locator('.schema-name', { hasText: /^driverId$/ }).first()).toBeVisible();

    await expect(
      apiDocs.messageTab('topics/driver-location/messages', 'Driver Location Update'),
    ).toBeVisible();
    await expect(
      apiDocs.messageTab('topics/driver-location/messages', 'Driver Status Change'),
    ).toBeVisible();
  });
});
