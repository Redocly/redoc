import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('Deep links asyncapi', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/asyncapi');
    await apiDocs.waitForPageLoad();
  });

  test('should navigate to a channel using deep link', async () => {
    await apiDocs.navigateToChannelDeepLink('rides', 'ride-requests');

    const channelName = 'Ride Requests Topic';
    await apiDocs.waitForChannelLoad(channelName);
    const isVisible = await apiDocs.isChannelVisible(channelName);
    const linkHref = await apiDocs.getLinkHref(channelName);

    expect(isVisible).toBe(true);
    expect(linkHref).toBe(`/asyncapi/rides/topics/ride-requests`);
  });

  test('should navigate to a message using deep link', async () => {
    await apiDocs.navigateToMessageDeepLink(
      'rides/topics/ride-requests',
      'ride%20request%20cancellation',
    );
    const messageName = 'Ride Request Cancellation';
    const sectionId = '/asyncapi/rides/topics/ride-requests/messages';
    await apiDocs.waitForMessageLoad(sectionId, messageName);

    const isVisible = await apiDocs.isMessageVisible(sectionId, messageName);
    const hash = await apiDocs.getCurrentHash();

    expect(isVisible).toBe(true);
    expect(hash).toBe(`#rides/topics/ride-requests/messages&m=ride%20request%20cancellation`);
  });

  test('should navigate to a schema using deep link', async () => {
    const schema = 'pickupLocation';
    await apiDocs.navigateToSchemaDeepLink(
      'rides/topics/ride-requests',
      'requestride',
      schema.toLowerCase(),
    );
    await apiDocs.waitForSchemaLoad(schema);

    const isVisible = await apiDocs.isSchemaVisible(schema);
    const hash = await apiDocs.getCurrentHash();

    expect(isVisible).toBe(true);
    expect(hash).toBe(
      `#rides/topics/ride-requests/messages&m=requestride&t=payload&path=pickuplocation`,
    );
  });

  test('should navigate to a nested schema property', async () => {
    const schema = 'vehicleDetails';
    await apiDocs.navigateToSchemaDeepLink(
      'rides/topics/ride-matches',
      'drivermatch',
      schema.toLowerCase(),
    );
    await apiDocs.waitForSchemaLoad(schema);

    const isVisible = await apiDocs.isSchemaVisible(schema);
    const hash = await apiDocs.getCurrentHash();

    expect(isVisible).toBe(true);
    expect(hash).toBe(
      `#rides/topics/ride-matches/messages&m=drivermatch&t=payload&path=vehicledetails`,
    );
  });

  test('should navigate to a message example', async () => {
    await apiDocs.navigateToMessageExample(
      'rides/topics/ride-requests',
      'requestride',
      'standard-ride-request',
    );
    const sectionId = '/asyncapi/rides/topics/ride-requests/messages';
    await apiDocs.waitForMessageLoad(sectionId, 'Ride Request');

    const isVisible = await apiDocs.isMessageVisible(sectionId, 'Ride Request');
    const hash = await apiDocs.getCurrentHash();

    expect(isVisible).toBe(true);
    expect(hash).toBe(
      `#rides/topics/ride-requests/messages&m=requestride&example=standard-ride-request`,
    );
  });

  test('should navigate to message headers', async () => {
    await apiDocs.navigateToMessageHeaders('rides/topics/ride-matches', 'drivermatch');
    const sectionId = '/asyncapi/rides/topics/ride-matches/messages';
    await apiDocs.waitForMessageLoad(sectionId, 'Driver Match');

    const isVisible = await apiDocs.isMessageVisible(sectionId, 'Driver Match');
    const hash = await apiDocs.getCurrentHash();

    expect(isVisible).toBe(true);
    expect(hash).toBe(`#rides/topics/ride-matches/messages&m=drivermatch&t=headers`);
  });

  test('should navigate to a complex nested schema', async () => {
    const schema = 'breakdown';
    await apiDocs.navigateToSchemaDeepLink(
      'payments',
      'paymentcompleted',
      `finalamount.${schema.toLowerCase()}`,
    );
    await apiDocs.waitForSchemaLoad(schema);

    const isVisible = await apiDocs.isSchemaVisible(schema);
    const hash = await apiDocs.getCurrentHash();

    expect(isVisible).toBe(true);
    expect(hash).toBe(`#payments/messages&m=paymentcompleted&t=payload&path=finalamount.breakdown`);
  });

  test('should maintain deep link after page refresh', async () => {
    await apiDocs.navigateToChannelDeepLink('rides', 'ride-requests');
    const channelName = 'Ride Requests Topic';
    await apiDocs.waitForChannelLoad(channelName);

    await apiDocs.refreshPage();

    const isVisible = await apiDocs.isChannelVisible(channelName);

    expect(isVisible).toBe(true);
  });

  test('should handle invalid deep links gracefully', async () => {
    const invalidChannelName = 'nonexistent/channel';
    await apiDocs.navigateToChannelDeepLink('rides', invalidChannelName);
    await expect(
      apiDocs.page.getByRole('heading', { name: 'No page at this address' }),
    ).toBeVisible();
  });

  test('deep-links to a non-default message + schema prop, and restores it on reload after a manual switch', async () => {
    const messagesSectionId = '/asyncapi/rides/topics/ride-requests/messages';
    const messages = apiDocs.page.locator(`[data-section-id="${messagesSectionId}"]`);

    const cancellationSummary = 'A passenger cancels a previously submitted ride request';
    const defaultDescription = 'Core message that initiates the ride flow';

    await apiDocs.navigateToSchemaDeepLink(
      'rides/topics/ride-requests',
      'cancelriderequest',
      'reasondetails',
    );
    await expect(messages.getByText(cancellationSummary)).toBeVisible();
    await expect(messages.getByText('reasonDetails').first()).toBeInViewport();
    await expect(messages.getByText(defaultDescription)).toHaveCount(0);

    await messages.getByRole('tab', { name: 'Ride Request', exact: true }).click();
    await expect(messages.getByText(defaultDescription)).toBeVisible();
    await expect(messages.getByText(cancellationSummary)).toHaveCount(0);

    await apiDocs.refreshPage();
    await expect(messages.getByText(cancellationSummary)).toBeVisible();
    await expect(messages.getByText('reasonDetails').first()).toBeInViewport();
    await expect(messages.getByText(defaultDescription)).toHaveCount(0);
  });
});
