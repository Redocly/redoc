import { jsonToHTML } from '../jsonToHtml';
import { parseJsonPreservingBigInts } from '../preciseJson';

describe('jsonToHTML', () => {
  it('renders an int64 value with every digit', () => {
    const value = parseJsonPreservingBigInts('{"id": 10765432100123456789, "small": 42}');

    const html = jsonToHTML(value, 1);

    expect(html).toContain('<span class="token number">10765432100123456789</span>');
    expect(html).toContain('<span class="token number">42</span>');
    // the truncated form must not show up anywhere
    expect(html).not.toContain('10765432100123458000');
  });

  it('renders int64 values inside arrays', () => {
    const value = parseJsonPreservingBigInts('{"ids": [10765432100123456789]}');

    const html = jsonToHTML(value, 1);

    expect(html).toContain('<span class="token number">10765432100123456789</span>');
  });

  it('keeps rendering plain numbers as before', () => {
    expect(jsonToHTML(42, 1)).toContain('<span class="token number">42</span>');
    expect(jsonToHTML(-7, 1)).toContain('<span class="token number">-7</span>');
    expect(jsonToHTML(1.5, 1)).toContain('<span class="token number">1.5</span>');
  });

  it('keeps rendering null, boolean, string and object values', () => {
    const html = jsonToHTML(null, 1);
    expect(html).toContain('<span class="token keyword">null</span>');

    const value = jsonToHTML({ ok: true, name: 'redoc', nested: { deep: 1 } }, 1);
    expect(value).toContain('<span class="token boolean">true</span>');
    expect(value).toContain('<span class="token string">&quot;redoc&quot;</span>');
    expect(value).toContain('<span class="token number">1</span>');
  });
});
