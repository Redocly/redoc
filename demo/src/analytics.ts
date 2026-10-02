// TODO: set the GA4 web-stream Measurement ID for redocly.github.io to enable analytics
const GA_MEASUREMENT_ID: string = '';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

if (GA_MEASUREMENT_ID && window.location.host === 'redocly.github.io') {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  const dataLayer = (window.dataLayer = window.dataLayer ?? []);
  // gtag commands must push the live `arguments` object, not an array
  const gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  } as (...args: unknown[]) => void;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

export {};
