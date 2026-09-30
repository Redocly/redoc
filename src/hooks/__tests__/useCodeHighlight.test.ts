import { describe, expect, it } from 'vitest';

import { useCodeHighlight } from '../useCodeHighlight.js';

describe('useCodeHighlight', () => {
  it('highlights unquoted basic auth placeholders as strings in curl samples', () => {
    const source = "curl -i -X GET \\\n  -u <username>:<password> \\\n  'http://example.com/x'";

    const html = useCodeHighlight(source, 'bash');

    expect(html).toContain(
      '<span class="token placeholder string">&lt;username></span>:<span class="token placeholder string">&lt;password></span>',
    );
  });

  it('keeps quoted strings intact', () => {
    const html = useCodeHighlight("curl 'http://example.com/<id>'", 'bash');

    expect(html).toContain('<span class="token string">\'http://example.com/&lt;id>\'</span>');
  });
});
