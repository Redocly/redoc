export function urlParse(url: string, slashesDenoteHost = false): URL | null {
  // Handle slashesDenoteHost parameter
  let processedUrl = url;
  if (slashesDenoteHost && processedUrl.startsWith('//')) {
    // When slashesDenoteHost is true, //example.com should be treated as having a host
    // Add a dummy protocol to make it a valid URL
    processedUrl = 'http:' + url;
  }
  try {
    return URL?.parse ? URL?.parse(processedUrl) : new URL(processedUrl);
  } catch (error) {
    console.error(`Invalid URL: ${processedUrl}`, error);
    return null;
  }
}

export function getUrlDirname(urlLikeString: string): string | undefined {
  try {
    const url = new URL(urlLikeString);
    let pathname = url.pathname;

    if (pathname.endsWith('/')) {
      return url.origin + pathname;
    }

    const lastSlashIndex = pathname.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      pathname = pathname.substring(0, lastSlashIndex + 1);
      return url.origin + pathname;
    } else {
      return url.origin + '/';
    }
  } catch (error) {
    console.error(`Invalid URL: ${urlLikeString}`, error);
    return;
  }
}
