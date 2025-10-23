interface MobileOptions {
  tablet?: boolean;
}

export function isMobile(opts: MobileOptions = {}): boolean {
  const mobileRE =
    /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  const notMobileRE = /CrOS/;
  const tabletRE = /android|ipad|playbook|silk/i;

  const isMobileUserAgent =
    mobileRE.test(navigator.userAgent) && !notMobileRE.test(navigator.userAgent);
  const isTabletUserAgent = opts.tablet && tabletRE.test(navigator.userAgent);
  const isMacSafariTablet =
    opts.tablet &&
    navigator.maxTouchPoints > 1 &&
    navigator.userAgent.indexOf('Macintosh') !== -1 &&
    navigator.userAgent.indexOf('Safari') !== -1;

  return !!(isMobileUserAgent || isTabletUserAgent || isMacSafariTablet);
}
