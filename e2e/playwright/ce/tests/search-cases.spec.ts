import { expect, test } from '../test.js';

import type { Locator, Page } from '@playwright/test';

import { Search } from '../page-objects/Search.js';
import { StandalonePage } from '../page-objects/StandalonePage.js';

// Every sentence in the fixtures appears exactly once, so each query has one right answer.
const OPENAPI = '/pages/options-attributes.html?spec-url=/fixtures/search-cases.yaml';
const ASYNCAPI = '/pages/options-attributes.html?spec-url=/fixtures/search-events.yaml';
const GRAPHQL = '/pages/options-attributes.html?spec-url=/fixtures/search-cases.graphql';

type Case = {
  part: string;
  query: string;
  /** Substrings the first result's href must contain; `exactHref` pins the whole value. */
  expectHref: string[];
  exactHref?: string;
  notHref?: string;
  /** Enterprise-only surface (the CE overview has no `x-metadata` table); the portal runner still covers it. */
  portalOnly?: boolean;
};

const OPENAPI_CASES: Case[] = [
  {
    part: 'operation by title',
    query: 'Place an order',
    expectHref: ['orders/placeorder'],
  },
  {
    part: 'operation by path',
    query: '/warehouses',
    expectHref: ['warehouses/listwarehouses'],
  },
  {
    part: 'operation by description',
    query: 'Cancels an order that has not been packed yet',
    expectHref: ['orders/cancelorder'],
  },
  {
    part: 'parameter by name',
    query: 'daysPerPage',
    expectHref: ['path=daysperpage'],
  },
  {
    part: 'field by name',
    query: 'trackingNumber',
    expectHref: ['path=trackingnumber'],
  },
  {
    part: 'discriminator variant A',
    query: 'Final four digits of the card number',
    expectHref: ['orders/placeorder', 'path=payment&d=0/last4'],
  },
  {
    part: 'discriminator variant B',
    query: 'International bank account number of the payer',
    expectHref: ['orders/placeorder', 'path=payment&d=1/iban'],
  },
  {
    part: 'discriminator value (const)',
    query: 'voucher',
    expectHref: ['orders/placeorder', 'path=payment/method'],
  },
  {
    part: 'query inside a word',
    query: 'livered',
    expectHref: ['parceldelivered'],
  },
  {
    part: 'operation by http method',
    query: 'POST',
    expectHref: ['orders/placeorder'],
    notHref: 'warehouses',
  },
  {
    part: 'callback field',
    query: 'Status the order moved into when the callback fired',
    expectHref: ['cb=onstatuschange', 'path=newstatus'],
  },
  {
    part: 'response header',
    query: 'Requests left in the current window',
    expectHref: ['t=response&c=201', 'path=x-rate-limit-remaining'],
  },
  {
    part: 'substring trap',
    query: 'Number of days per page',
    expectHref: ['path=daysperpage'],
    notHref: 'dryrun',
  },
  {
    part: 'same word set in two fields',
    query: 'Passenger has left a note for the driver',
    expectHref: ['path=departurenote'],
    notHref: 'arrivalnote',
  },
  {
    part: 'MCP tool input field',
    query: 'Ledger identifier the agent supplies when looking up',
    expectHref: ['tools/lookuporder', 't=input-schema&path=orderid'],
  },
  {
    part: 'operation by security scheme',
    query: 'LedgerKey',
    expectHref: ['orders/placeorder'],
  },
  {
    part: 'request body description',
    query: 'Cart snapshot the ledger turns into an order',
    expectHref: ['orders/placeorder', 'request/body'],
  },
  {
    part: 'operation by example name',
    query: 'Corporate card checkout',
    expectHref: ['orders/placeorder', 'request/body'],
  },
  {
    part: 'overview by server variable',
    query: 'Region that answers the gateway call',
    expectHref: [],
    exactHref: '#/',
  },
  {
    part: 'overview by server description',
    query: 'Production gateway answering the checklist calls',
    expectHref: [],
    exactHref: '#/',
  },
  {
    part: 'overview by license',
    query: 'Checklist Public License',
    expectHref: [],
    exactHref: '#/',
  },
  {
    part: 'MCP prompt argument',
    query: 'Voice of the apology, formal or casual',
    expectHref: ['prompts/draftapology', 't=arguments&path=tone'],
  },

  {
    part: 'description heading',
    query: 'Repeat a request safely with the same key',
    expectHref: ['orders/placeorder', 'request/idempotency-keys'],
  },
  {
    part: 'header parameter',
    query: 'Header token that lets the kiosk retry a submission',
    expectHref: ['in=headers&path=x-idempotency-key'],
  },
  {
    part: 'cookie parameter',
    query: 'Cookie proving the shopper is present in the store',
    expectHref: ['in=cookies&path=shoppersession'],
  },
  {
    part: 'path parameter',
    query: 'Identifier of the order to fetch from the ledger',
    expectHref: ['orders/getorder', 'in=path&path=orderid'],
  },
  {
    part: 'response description',
    query: 'Order accepted into the ledger',
    expectHref: ['orders/placeorder', 'response&c=201'],
    notHref: 'path=',
  },
  {
    part: 'response field',
    query: 'Moment the ledger accepted the order',
    expectHref: ['t=response', 'path=createdat'],
  },
  {
    part: 'nested field',
    query: 'Postal code used for delivery routing',
    expectHref: ['path=shipping/address/postalcode'],
  },
  {
    part: 'array item field',
    query: 'Stock keeping unit of the line item',
    expectHref: ['path=items[]/sku'],
  },
  {
    part: 'additionalProperties field',
    query: 'Arbitrary key value pairs attached by the merchant',
    expectHref: ['path=metadata'],
  },
  {
    part: 'markdown link stripped',
    query: 'See the integration guide for details',
    expectHref: ['path=docsurl'],
  },
  {
    part: 'html stripped',
    query: 'Problem type in the form of a URI reference',
    expectHref: ['path=problemtype'],
  },
  {
    part: 'example unique to a media type',
    query: 'Legacy XML receipt for the kiosk printer',
    expectHref: ['response&c=201', 'ct=application/xml', 'ex=legacyxmlreceipt'],
  },
  {
    part: 'response example',
    query: 'Ledger receipt for an accepted order',
    expectHref: ['response&c=201', 'ex=acceptedorder'],
  },
  {
    part: 'callback by summary',
    query: 'Status change notification',
    expectHref: ['callbacks/onstatuschange/post'],
  },
  {
    part: 'callback response',
    query: 'Callback acknowledged by the merchant',
    expectHref: ['callbacks/onstatuschange/post/response&c=200'],
  },
  {
    part: 'security scheme header name',
    query: 'X-Ledger-Key',
    expectHref: ['orders/placeorder'],
  },
  {
    part: 'tag page by description',
    query: 'Order lifecycle endpoints',
    expectHref: ['orders'],
    notHref: 'orders/',
  },
  {
    part: 'webhook by description',
    query: 'Sent to the merchant once the courier hands over the parcel',
    expectHref: ['parceldelivered'],
  },
  {
    part: 'webhook field',
    query: 'Person who signed for the parcel at the door',
    expectHref: ['parceldelivered', 'path=signedby'],
  },
  {
    part: 'overview by contact email',
    query: 'checklist@search-cases.local',
    expectHref: [],
    exactHref: '#/',
  },
  {
    part: 'overview by terms link',
    query: 'search-cases.local/terms-of-service',
    expectHref: [],
    exactHref: '#/',
  },
  {
    part: 'overview by metadata value',
    query: 'Ledger platform guild',
    expectHref: [],
    exactHref: '#/',
    portalOnly: true,
  },
  {
    part: 'overview by metadata token',
    query: 'gold-lane',
    expectHref: [],
    exactHref: '#/',
    portalOnly: true,
  },
  {
    part: 'MCP tool by description',
    query: 'Finds an order by its ledger identifier for an agent',
    expectHref: ['tools/lookuporder'],
    notHref: 'path=',
  },
  {
    part: 'MCP tool output field',
    query: 'Estimated delivery time returned to the agent',
    expectHref: ['tools/lookuporder', 't=output-schema&path=eta'],
  },
  {
    part: 'MCP resource by description',
    query: 'Read-only snapshot of the product catalog for agents',
    expectHref: ['resources/catalog'],
  },
  {
    part: 'MCP resource by uri',
    query: 'cases://catalog',
    expectHref: ['resources/catalog'],
  },
  {
    part: 'MCP prompt by description',
    query: 'Draft an apology message for a late order',
    expectHref: ['prompts/draftapology'],
    notHref: 'path=',
  },
];

const ASYNCAPI_CASES: Case[] = [
  {
    part: 'topic by address',
    query: 'nexus.orders.{region}.order-lifecycle',
    expectHref: ['topics/orders'],
  },
  {
    part: 'topic by address segment',
    query: 'order-lifecycle',
    expectHref: ['topics/orders'],
  },
  {
    part: 'overview by broker variable',
    query: 'Geographic region for the rehearsal brokers',
    expectHref: [],
    exactHref: '#/',
  },
  {
    part: 'topic by broker host',
    query: 'staging-broker.search-cases.local:9092',
    expectHref: ['topics/alerts'],
  },
  {
    part: 'topic by broker summary',
    query: 'Rehearsal cluster that receives every alert first',
    expectHref: ['topics/alerts'],
  },
  {
    part: 'message summary, phrase tie-break',
    query: 'Courier has confirmed an order for the customer',
    expectHref: ['m=ordershipped'],
  },
  {
    part: 'message summary, reverse',
    query: 'Customer has confirmed an order for the courier',
    expectHref: ['m=orderplaced'],
  },
  {
    part: 'message headers',
    query: 'Correlates every event of one order',
    expectHref: ['m=orderplaced&t=headers&path=x-correlation-id'],
  },
  {
    part: 'message bindings',
    query: 'Partition key derived from the order identifier',
    expectHref: ['m=orderplaced&t=bindings&path=key'],
  },

  {
    part: 'topic by description',
    query: 'Low stock warnings per warehouse',
    expectHref: ['topics/alerts'],
  },
  {
    part: 'channel parameter',
    query: 'Deployment region the topic is partitioned by',
    expectHref: ['topics/orders', 'in=parameters&path=region'],
  },
  {
    part: 'overview by default broker',
    query: 'Kafka broker for the checklist events',
    expectHref: [],
    exactHref: '#/',
  },
  {
    part: 'operation by title',
    query: 'Receive stock alerts',
    expectHref: ['operations/receivestockalerts'],
  },
  {
    part: 'operation by summary',
    query: 'Consume placed and shipped events',
    expectHref: ['operations/receiveorderevents'],
  },
  {
    part: 'message by description',
    query: 'Emitted when the parcel leaves the warehouse dock',
    expectHref: ['m=ordershipped'],
  },
  {
    part: 'payload array item field',
    query: 'Scan status of one parcel in the shipment',
    expectHref: ['m=ordershipped&t=payload&path=parcels[]/status'],
  },
  {
    part: 'message example',
    query: 'Kiosk order captured on a Sunday morning',
    expectHref: ['topics/orders', 'm=orderplaced'],
  },
  {
    part: 'payload field in another topic',
    query: 'Units left on the shelf when the alert fired',
    expectHref: ['m=stockalert&t=payload&path=remaining'],
  },
];

const GRAPHQL_CASES: Case[] = [
  {
    part: 'argument row',
    query: 'Maximum number of orders returned in one page',
    expectHref: ['queries/orders', 'arg=first'],
  },

  {
    part: 'object by description',
    query: 'An order in the ledger',
    expectHref: ['objects/order'],
  },
  {
    part: 'object field',
    query: 'Carrier tracking number once dispatched',
    expectHref: ['t=field&path=order.trackingnumber'],
  },
  {
    part: 'enum value',
    query: 'All items boxed and labelled',
    expectHref: ['enums/orderstatus/values'],
  },
  {
    part: 'input field',
    query: 'Promotional coupon redeemed through GraphQL',
    expectHref: ['inputs/placeorderinput', 'path=placeorderinput.couponcode'],
  },
  {
    part: 'mutation by description',
    query: 'Create an order from the cart',
    expectHref: ['mutations/placeorder'],
  },
  {
    part: 'subscription argument',
    query: 'Restrict the stream to one order',
    expectHref: ['subscriptions/orderupdated', 'arg=id'],
  },
  {
    part: 'union by description',
    query: 'Either an order or a warehouse',
    expectHref: ['unions/searchresult'],
  },
  {
    part: 'interface field',
    query: 'Ledger identifier of the node',
    expectHref: ['interfaces/node', 'path=node.id'],
  },
  {
    part: 'directive by description',
    query: 'Caps how many calls one client may make per minute',
    expectHref: ['directives/ratelimited'],
  },
  {
    part: 'directive argument',
    query: 'Requests allowed per minute for one client',
    expectHref: ['directives/ratelimited', 'arg=rpm'],
  },
  {
    part: 'query by description',
    query: 'Search orders and warehouses in one query',
    expectHref: ['queries/search'],
  },
];

async function hrefs(results: Locator): Promise<string[]> {
  return (
    await results.evaluateAll((rows) => rows.map((row) => row.getAttribute('href') ?? ''))
  ).map((href) => href.toLowerCase());
}

function runCases(pageUrl: string, cases: Case[]): void {
  for (const { part, query, expectHref, exactHref, notHref, portalOnly } of cases) {
    if (portalOnly) continue;
    test(`${part}: "${query}"`, async ({ page }) => {
      await new StandalonePage(page).goto(pageUrl);
      const results = await new Search(page).expectHitsFor(query);
      const [first] = await hrefs(results);
      for (const fragment of expectHref) expect(first).toContain(fragment.toLowerCase());
      if (exactHref) expect(first).toBe(exactHref);
      if (notHref) expect(first).not.toContain(notHref);
    });
  }
}

function field(page: Page, id: string): Locator {
  return page.locator(`[id="${id}"]`);
}

test.describe('search finds the parts that are hard to check by hand', () => {
  test.describe('OpenAPI + MCP', () => runCases(OPENAPI, OPENAPI_CASES));
  test.describe('AsyncAPI', () => runCases(ASYNCAPI, ASYNCAPI_CASES));
  test.describe('GraphQL', () => runCases(GRAPHQL, GRAPHQL_CASES));

  test('a hit on an enum value the row does not show surfaces it as an Enum line', async ({
    page,
  }) => {
    await new StandalonePage(page).goto(OPENAPI);
    const results = await new Search(page).expectHitsFor('voucher');
    await expect(results.first()).toContainText('Enum:');
    await expect(results.first()).toContainText('voucher');
  });

  test('a field shared by three operations keeps a row per operation', async ({ page }) => {
    // No schema-definition pages in this host, so there is nothing to collapse into.
    await new StandalonePage(page).goto(OPENAPI);
    const results = await new Search(page).expectHitsFor('Lifecycle status of an order');
    const rows = await hrefs(results);
    for (const operation of ['orders/listorders', 'orders/getorder', 'orders/placeorder']) {
      expect(
        rows.filter((href) => href.includes(operation) && href.includes('path=status')),
      ).toHaveLength(1);
    }
  });

  test('a topic hit shows its address next to the protocol tag', async ({ page }) => {
    await new StandalonePage(page).goto(ASYNCAPI);
    const results = await new Search(page).expectHitsFor('nexus.orders.{region}.order-lifecycle');
    await expect(results.first()).toContainText('TOPIC');
    await expect(results.first()).toContainText('nexus.orders.{region}.order-lifecycle');
  });

  test('same field name in two messages yields one row per message', async ({ page }) => {
    await new StandalonePage(page).goto(ASYNCAPI);
    const results = await new Search(page).expectHitsFor('Lifecycle status carried by the event');
    const rows = await hrefs(results);
    expect(
      rows.filter((href) => href.includes('m=orderplaced&t=payload&path=status')),
    ).toHaveLength(1);
    expect(
      rows.filter((href) => href.includes('m=ordershipped&t=payload&path=status')),
    ).toHaveLength(1);
  });
});

test.describe('landing on a result re-applies the selection it names', () => {
  const SHIPPED_FIELD = 'topics/orders/messages&m=ordershipped&t=payload&path=carrier';
  const PLACED_FIELD = 'topics/orders/messages&m=orderplaced&t=payload&path=placedby';

  test('switches to the message a result belongs to', async ({ page }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(ASYNCAPI);
    await apiDocs.clickThroughMenu('Order Events Topic');
    await expect(field(page, PLACED_FIELD)).toBeVisible();

    const results = await new Search(page).expectHitsFor(
      'Courier has confirmed an order for the customer',
    );
    await results.first().click();

    await expect(field(page, SHIPPED_FIELD)).toBeVisible();
    expect(page.url()).toContain('m=ordershipped');
  });

  test('re-applies the message when the result is clicked again for the current URL', async ({
    page,
  }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(ASYNCAPI);
    await apiDocs.clickThroughMenu('Order Events Topic');
    const search = new Search(page);
    await (
      await search.expectHitsFor('Courier has confirmed an order for the customer')
    )
      .first()
      .click();
    await expect(field(page, SHIPPED_FIELD)).toBeVisible();

    // The reader switches away by hand; the URL still names the shipped message.
    await page.getByRole('tab', { name: 'Order Placed' }).click();
    await expect(field(page, PLACED_FIELD)).toBeVisible();
    expect(page.url()).toContain('m=ordershipped');

    await (
      await search.expectHitsFor('Courier has confirmed an order for the customer')
    )
      .first()
      .click();
    await expect(field(page, SHIPPED_FIELD)).toBeVisible();
  });

  test('selects the custom example a result names, also after a manual switch', async ({
    page,
  }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(OPENAPI);
    const search = new Search(page);
    const exampleSelector = page.getByRole('button', {
      name: 'Example',
      exact: true,
    });

    await (await search.expectHitsFor('Bank transfer at the kiosk')).first().click();
    await expect(exampleSelector).toHaveText('Bank transfer at the kiosk');
    expect(page.url()).toContain('ex=banktransfer');

    // The reader switches by hand; the URL still names the bank-transfer example.
    await exampleSelector.click();
    await page.getByText('Corporate card checkout', { exact: true }).click();
    await expect(exampleSelector).toHaveText('Corporate card checkout');

    await (await search.expectHitsFor('Bank transfer at the kiosk')).first().click();
    await expect(exampleSelector).toHaveText('Bank transfer at the kiosk');
  });

  test('re-applies the discriminator variant after a manual switch', async ({ page }) => {
    const CARD_FIELD = 'orders/placeorder/t=request&path=payment&d=0/last4';
    const BANK_FIELD = 'orders/placeorder/t=request&path=payment&d=1/iban';
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(OPENAPI);
    const search = new Search(page);

    const cardRow = () => search.results.and(page.locator('[href*="d=0/last4"]')).first();
    await search.expectHitsFor('Final four digits of the card number');
    await cardRow().click();
    await expect(field(page, CARD_FIELD)).toBeVisible();

    // The reader switches the variant by hand; the URL still names the card variant.
    await page.getByRole('tab', { name: 'bank', exact: true }).click();
    await expect(field(page, BANK_FIELD)).toBeVisible();

    await search.expectHitsFor('Final four digits of the card number');
    await cardRow().click();
    await expect(field(page, CARD_FIELD)).toBeVisible();
  });
});
