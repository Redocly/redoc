import { expect, test } from '../test.js';

import type { Page } from '@playwright/test';

import { StandalonePage } from '../page-objects/StandalonePage.js';

const HOST_PAGE = '/pages/host-page.html';
const PLAIN_PAGE = '/pages/options-attributes.html?spec-url=/fixtures/host-page.yaml';
const SWITCHER = '[data-testid="color-mode-switcher"]';

const HOST_OVERRIDES = `
  :root {
    --sidebar-width: 320px;
    --font-family-base: "Trebuchet MS", sans-serif;
    --border-radius: 8px;
  }
  :root:has(.redoc.light) {
    --bg-color: rgb(255, 251, 235);
  }
  :root:has(.redoc.dark) {
    --bg-color: rgb(30, 27, 75);
  }
  html .redoc .tag-get,
  html .redoc.dark .tag-get {
    --tag-color: rgb(124, 58, 237);
  }
`;

async function openHostPage(
  page: Page,
  { mode, htmlAttributes = {} }: { mode?: string; htmlAttributes?: Record<string, string> } = {},
): Promise<void> {
  await page.goto(HOST_PAGE);
  await page.evaluate(
    ({ storedMode, attributes }) => {
      if (storedMode) window.localStorage.setItem('redoc.colorMode', storedMode);
      for (const [name, value] of Object.entries(attributes)) {
        document.documentElement.setAttribute(name, value);
      }
    },
    { storedMode: mode, attributes: htmlAttributes },
  );
}

async function loadRedoc(page: Page): Promise<StandalonePage> {
  await page.addScriptTag({ type: 'module', url: '/bundles/redoc.standalone.js' });
  const apiDocs = new StandalonePage(page);
  await apiDocs.sidebar.waitFor({ state: 'visible' });
  return apiDocs;
}

function readHostStyles(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const style = (selector: string, properties: string[]): string => {
      const element = document.querySelector(selector);
      const computed = element ? getComputedStyle(element) : null;
      return properties.map((property) => computed?.getPropertyValue(property)).join(' | ');
    };
    const scroller = document.querySelector<HTMLElement>('#host-scroller');
    return {
      htmlClass: document.documentElement.className,
      html: style('html', ['color', 'font-family', 'background-color', 'color-scheme']),
      paragraph: style('#host-paragraph', ['color', 'font-family']),
      layeredButton: style('#host-layered-button', [
        'background-color',
        'border-top-style',
        'font-family',
      ]),
      unlayeredButton: style('#host-unlayered-button', ['background-color', 'font-family']),
      plainButton: style('#host-plain-button', [
        'background-color',
        'border-top-style',
        'font-family',
        'cursor',
      ]),
      input: style('#host-input', ['background-color', 'color']),
      utility: style('#host-utility', ['color', 'background-color']),
      boxWidth: String(document.querySelector<HTMLElement>('#host-box')?.offsetWidth),
      scrollbarWidth: String(scroller ? scroller.offsetWidth - scroller.clientWidth : ''),
      card: style('#host-card', ['background-color', 'color']),
      list: style('#host-list', ['list-style-type', 'padding-left']),
    };
  });
}

function readDescriptionStyles(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const properties = [
      'display',
      'margin-top',
      'margin-bottom',
      'padding-left',
      'list-style-type',
      'font-size',
      'font-weight',
      'font-family',
      'color',
      'text-decoration-line',
    ];
    const describe = (element: Element | null | undefined): string => {
      if (!element) return 'missing';
      const computed = getComputedStyle(element);
      return properties.map((property) => computed.getPropertyValue(property)).join(' | ');
    };
    const find = (selector: string, text: string): Element | undefined =>
      [...document.querySelectorAll(`.redoc ${selector}`)].find((element) =>
        element.textContent?.includes(text),
      );
    const item = find('li', 'First item');
    return {
      heading: describe(find('h2', 'Description heading')),
      list: describe(item?.parentElement),
      item: describe(item),
      link: describe(document.querySelector('.redoc a[href="https://example.com"]')),
      code: describe(find('code', 'inline code')),
      linkIconSymbol: describe(
        document.querySelector('.redoc [data-component-name="icons/LinkIcon/LinkIconSymbol"]'),
      ),
    };
  });
}

for (const mode of ['light', 'dark']) {
  test(`leaves the host page styles alone in ${mode} mode`, async ({ page }) => {
    await openHostPage(page, { mode });
    const before = await readHostStyles(page);

    await loadRedoc(page);

    await expect(page.locator('.redoc').first()).toHaveClass(new RegExp(`\\b${mode}\\b`));
    const after = await readHostStyles(page);
    if (mode === 'dark') after.utility = before.utility;
    expect(after).toEqual(before);
  });
}

test('keeps browser defaults in descriptions when the host resets them', async ({
  page,
  context,
}) => {
  await openHostPage(page);
  await loadRedoc(page);

  const plainPage = await context.newPage();
  await new StandalonePage(plainPage).goto(PLAIN_PAGE);

  expect(await readDescriptionStyles(page)).toEqual(await readDescriptionStyles(plainPage));
  await expect(
    page.locator('.redoc [data-component-name="icons/LinkIcon/LinkIconSymbol"]'),
  ).toHaveCSS('display', 'none');
});

test('renders theme tooltips in the Redoc font and color mode', async ({ page }) => {
  await openHostPage(page, { mode: 'dark' });
  await loadRedoc(page);
  const rootFont = await page
    .locator('.redoc')
    .first()
    .evaluate((root) => getComputedStyle(root).fontFamily);

  await page.locator(SWITCHER).hover();
  const tooltip = page.locator('[data-testid="Switch color mode"]').last();

  await expect(tooltip).toHaveCSS('font-family', rootFont);
  expect(await tooltip.evaluate((element) => element.closest('.redoc')?.className)).toMatch(
    /\bdark\b/,
  );
  expect(
    await tooltip.evaluate(
      (element) => getComputedStyle(element.closest('.redoc') ?? element).display,
    ),
  ).toBe('contents');
});

const OVERRIDE_BACKGROUNDS = [
  ['light', 'rgb(255, 251, 235)'],
  ['dark', 'rgb(30, 27, 75)'],
] as const;

for (const [mode, background] of OVERRIDE_BACKGROUNDS) {
  test(`applies host CSS variable overrides in ${mode} mode`, async ({ page }) => {
    await openHostPage(page, { mode });
    await page.addStyleTag({ content: HOST_OVERRIDES });
    const apiDocs = await loadRedoc(page);
    const root = page.locator('.redoc').first();

    await expect(root).toHaveCSS('background-color', background);
    await expect(root).toHaveCSS('font-family', '"Trebuchet MS", sans-serif');
    await expect(apiDocs.sidebar).toHaveCSS('width', '320px');
    await expect(page.locator('.redoc .button-size-small').first()).toHaveCSS(
      'border-top-left-radius',
      '12px',
    );
    await expect(apiDocs.sidebar.locator('.tag-get').first()).toHaveCSS(
      'color',
      'rgb(124, 58, 237)',
    );
  });
}

test.describe('color mode sync with the host page', () => {
  test('follows the host class and writes a switcher pick back to it', async ({ page }) => {
    await openHostPage(page, { htmlAttributes: { class: 'dark' } });
    await loadRedoc(page);
    const root = page.locator('.redoc').first();
    await expect(root).toHaveClass(/\bdark\b/);

    await page.evaluate(() => document.documentElement.classList.replace('dark', 'light'));
    await expect(root).toHaveClass(/\blight\b/);

    await page.locator(SWITCHER).click();
    await expect(page.locator('html')).toHaveClass('dark');
    await expect(root).toHaveClass(/\bdark\b/);
  });

  test('follows Bootstrap data-bs-theme and writes a pick back without adding a class', async ({
    page,
  }) => {
    await openHostPage(page, { htmlAttributes: { 'data-bs-theme': 'dark' } });
    await loadRedoc(page);
    const root = page.locator('.redoc').first();
    await expect(root).toHaveClass(/\bdark\b/);

    await page.locator(SWITCHER).click();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    await expect(page.locator('html')).not.toHaveAttribute('class', /\S/);
    await expect(root).toHaveClass(/\blight\b/);
  });

  test('never writes to <html> when the host sets no mode', async ({ page }) => {
    await openHostPage(page, { mode: 'light' });
    await loadRedoc(page);
    const root = page.locator('.redoc').first();

    await page.locator(SWITCHER).click();
    await expect(root).toHaveClass(/\bdark\b/);
    expect(
      await page.evaluate(() =>
        [...document.documentElement.attributes].map((attribute) => attribute.name),
      ),
    ).toEqual(['lang']);
  });
});
