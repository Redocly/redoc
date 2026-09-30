import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

/** The switcher's accessible name tracks the active tab, which differs by edition. */
const MEDIA_TYPE_SWITCHER = /(Request|Payload) media type/;

test.describe('Sync sections', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/sync-section');
  });

  test('should sync right and middle panel', async ({ page }) => {
    await apiDocs.clickThroughMenu('sync', 'Get client access token');

    const section = apiDocs.section('/sync-section/sync/getaccesstoken');

    await expect(section.getSection()).toBeVisible();

    const rightPanel = section.getSection().locator('.panel-request-samples');
    await expect(rightPanel.getByRole('button', { name: MEDIA_TYPE_SWITCHER })).toBeVisible();
    await expect(rightPanel.getByRole('button', { name: 'Variant' })).toBeVisible();

    await expect(
      await rightPanel.getByRole('button', { name: MEDIA_TYPE_SWITCHER }).textContent(),
    ).toBe('application/json');
    await expect(await rightPanel.getByRole('button', { name: 'Variant' }).textContent()).toBe(
      'Identity Verification',
    );

    const requestBody = section.getSection().locator('[id="sync/getaccesstoken/request/body"]');
    await expect(requestBody.getByRole('tab', { name: 'Identity Verification' })).toBeVisible();
    await expect(requestBody.getByRole('tab', { name: 'Fraud Prevention' })).toBeVisible();
    await expect(requestBody.getByRole('tab', { name: 'A+ Services' })).toBeVisible();

    await requestBody.getByRole('tab', { name: 'Fraud Prevention' }).click();
    await expect(await rightPanel.getByRole('button', { name: 'Variant' }).textContent()).toBe(
      'Fraud Prevention',
    );

    await rightPanel.getByRole('button', { name: 'Variant' }).click();
    await page.getByRole('menuitem', { name: 'A+ Services' }).click();
    await expect(requestBody).toMatchAriaSnapshot(`
      - link "link to Body":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/request/body
      - text: Body
      - button "application/json":
        - text: ""
        - img
      - text: "required One of:"
      - tablist:
        - tab "Identity Verification"
        - tab "Fraud Prevention"
        - tab "A+ Services"
      - link "link to client_id":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=2/client_id
      - text: client_id
      - emphasis: string
      - text: required
      - paragraph: Client identifier
      - text: "Example: \\"YOUR_CLIENT_ID\\""
      - link "link to client_secret":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=2/client_secret
      - text: client_secret
      - emphasis: string
      - text: required
      - paragraph: Client secret
      - text: "Example: \\"YOUR_CLIENT_SECRET\\""
      - link "link to grant_type":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=2/grant_type
      - text: grant_type
      - emphasis: string
      - text: required
      - paragraph: Grant type must be client_credentials.
      - text: "Value: \\"client_credentials\\" Example: \\"client_credentials\\""
      - link "link to resource":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=2/resource
      - text: resource
      - emphasis: string
      - paragraph: URI of the resource the request is attempting to access.
    `);

    await page.getByRole('tab', { name: 'Fraud Prevention' }).click();
    await expect(page.locator('[id="sync/getaccesstoken/request/body"]')).toMatchAriaSnapshot(`
      - link "link to Body":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/request/body
      - text: Body
      - button "application/json":
        - text: ""
        - img
      - text: "required One of:"
      - tablist:
        - tab "Identity Verification"
        - tab "Fraud Prevention"
        - tab "A+ Services"
      - link "link to client_id":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=1/client_id
      - text: client_id
      - emphasis: string
      - text: required
      - paragraph: Client identifier
      - text: "Example: \\"YOUR_CLIENT_ID\\""
      - link "link to client_secret":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=1/client_secret
      - text: client_secret
      - emphasis: string
      - text: required
      - paragraph: Client secret
      - text: "Example: \\"YOUR_CLIENT_SECRET\\""
      - link "link to grant_type":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=1/grant_type
      - text: grant_type
      - emphasis: string
      - text: required
      - paragraph: Should be set to client_credentials.
      - text: "Value: \\"client_credentials\\" Example: \\"client_credentials\\""
      - link "link to resource":
        - /url: /sync-section/sync/getaccesstoken#sync/getaccesstoken/t=request&ct=application/json&path=&oneof=1/resource
      - text: resource
      - emphasis: string
      - paragraph: URI of the resource the request is attempting to access.
      - text: "Value: \\"https://risk.identity.security\\" Example: \\"https://risk.identity.security\\""
    `);
    await expect(await rightPanel.getByRole('button', { name: 'Variant' }).textContent()).toBe(
      'Fraud Prevention',
    );

    await expect(rightPanel.getByRole('button', { name: MEDIA_TYPE_SWITCHER })).toBeVisible();

    await rightPanel.getByRole('button', { name: MEDIA_TYPE_SWITCHER }).click();
    await page.getByRole('menu').getByText('application/x-www-form-').click();
    await expect(
      await rightPanel.getByRole('button', { name: MEDIA_TYPE_SWITCHER }).textContent(),
    ).toBe('application/x-www-form-urlencoded');
    await expect(
      await requestBody.locator('[data-testid="dropdown-item-media-type"]').textContent(),
    ).toBe('application/x-www-form-urlencoded');
    await expect(await rightPanel.getByRole('button', { name: 'Variant' }).textContent()).toBe(
      'Fraud Prevention',
    );
  });

});
