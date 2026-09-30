import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

const CHANNEL = '/asyncapi/rides/topics/ride-requests';
const MESSAGES_SECTION = 'ride-requests/messages';

test.describe('Message section Component', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);

    await goto(page, CHANNEL);
    await apiDocs.waitForChannelLoad('Ride Requests Topic');
  });

  test('should render the messages block with a switcher listing every channel message', async () => {
    const channel = apiDocs.sectionById(CHANNEL);
    await expect(channel.getByRole('heading', { name: 'Messages' }).first()).toBeVisible();
    await expect(
      apiDocs.messagesBlock(MESSAGES_SECTION).getByText('Accepts one of the following messages:'),
    ).toBeVisible();

    await expect(apiDocs.messageTab(MESSAGES_SECTION, 'Ride Request')).toBeVisible();
    await expect(apiDocs.messageTab(MESSAGES_SECTION, 'Ride Request Cancellation')).toBeVisible();
  });

  test('should show summary, description, headers and payload of the selected message', async () => {
    const messages = apiDocs.messagesBlock(MESSAGES_SECTION);

    await expect(
      messages.getByText('A passenger requests a new ride with pickup and destination locations'),
    ).toBeVisible();
    await expect(
      messages.getByText(
        'Core message that initiates the ride flow with all necessary details to match with a driver.',
      ),
    ).toBeVisible();

    await expect(messages.getByRole('heading', { name: 'Headers' })).toBeVisible();
    await expect(
      messages.getByText('Unique identifier for tracking the request across services'),
    ).toBeVisible();

    await expect(
      messages.getByText('Unique identifier for this specific ride request'),
    ).toBeVisible();
    await expect(messages.locator('.schema-name', { hasText: /^pickupLocation$/ })).toBeVisible();
  });

  test('should show the payload example of the selected message in the right panel', async () => {
    const example = apiDocs.messageExamplePanel(CHANNEL);
    await expect(
      example.getByText('Example of a typical ride request for a standard vehicle').first(),
    ).toBeVisible();
    await expect(example.locator('[data-testid="source-code"]')).toContainText('passengerId');
  });

  test('should update the payload and the bindings panel when switching messages', async () => {
    const messages = apiDocs.messagesBlock(MESSAGES_SECTION);
    const bindingsPanel = apiDocs.bindingPanel(CHANNEL, 'Message configuration');
    await expect(bindingsPanel.getByText('Passenger ID')).toBeVisible();

    await apiDocs.messageTab(MESSAGES_SECTION, 'Ride Request Cancellation').click();

    await expect(
      messages.getByText('A passenger cancels a previously submitted ride request'),
    ).toBeVisible();
    await expect(
      messages.getByText('A passenger requests a new ride with pickup and destination locations'),
    ).toHaveCount(0);
    await expect(messages.locator('.schema-name', { hasText: /^cancellationTime$/ })).toBeVisible();
    await expect(messages.locator('.schema-name', { hasText: /^pickupLocation$/ })).toHaveCount(0);

    await expect(bindingsPanel.getByText('Request ID')).toBeVisible();
    await expect(bindingsPanel.getByText('Passenger ID')).toHaveCount(0);

    await apiDocs.messageTab(MESSAGES_SECTION, 'Ride Request').click();

    await expect(
      messages.getByText('A passenger requests a new ride with pickup and destination locations'),
    ).toBeVisible();
    await expect(bindingsPanel.getByText('Passenger ID')).toBeVisible();
  });

  test('should scroll to the message switcher on each consecutive message deep link', async ({
    page,
  }) => {
    await goto(page, '/asyncapi/rides/topics/ride-status');
    await apiDocs.waitForChannelLoad('Ride Status Topic');

    const consumeSection = apiDocs.getOperationSection(
      '/asyncapi/rides/topics/ride-status/operations/receiveridestatus',
    );
    await consumeSection.scrollIntoViewIfNeeded();

    const messageLinks = consumeSection.locator('[data-component-name="Operation/MessageLinks"]');
    await expect(messageLinks.getByRole('link', { name: 'Ride Completed' })).toBeVisible();

    await apiDocs.waitForScrollIdle();
    await messageLinks.getByRole('link', { name: 'Ride Completed', exact: true }).click();
    await expect(page).toHaveURL(/m=ridecompleted/i);
    const firstTop = await apiDocs.settledMessageSwitcherTop(
      'ride-status/messages',
      'ridecompleted',
    );

    await apiDocs.waitForScrollIdle();
    await messageLinks.getByRole('link', { name: 'Ride Started', exact: true }).click();
    await expect(page).toHaveURL(/m=ridestarted/i);
    const secondTop = await apiDocs.settledMessageSwitcherTop(
      'ride-status/messages',
      'ridestarted',
    );

    expect(Math.abs(secondTop - firstTop)).toBeLessThan(24);
  });
});
