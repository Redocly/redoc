export const removeMarkdownLinks = (text: string | Record<string, any>) => {
  const _text = typeof text === 'string' ? text : text?.raw;
  return _text?.replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1') || '';
};
