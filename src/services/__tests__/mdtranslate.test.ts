import { MarkdownRenderer } from '../MarkdownRenderer';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

describe('MarkdownRenderer translate="no"', () => {
  const render = (md: string) => new MarkdownRenderer(new RedocNormalizedOptions({})).renderMd(md);

  it('marks fenced code blocks as non-translatable', () => {
    expect(render('```json\n{"a":1}\n```\n')).toContain('<div translate="no"><pre>');
  });

  it('marks inline code spans as non-translatable', () => {
    expect(render('Set `limit` to 10.')).toContain(
      '<span translate="no"><code>limit</code></span>',
    );
  });

  it('leaves surrounding prose translatable', () => {
    const out = render('Set `limit` to 10.');
    expect(out).toContain('<p>Set ');
    expect(out).not.toContain('<p translate="no"');
  });
});
