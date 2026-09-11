import * as fs from 'fs';
import * as path from 'path';
import defaultTheme, { resolveTheme } from '../../../theme';

describe('StyledMarkdownBlock heading colors', () => {
  const theme = resolveTheme(defaultTheme);
  const source = fs.readFileSync(path.resolve(__dirname, '../styled.elements.tsx'), 'utf-8');

  it('h1 and h2 should both reference colors.text.primary', () => {
    // Verify the theme has distinct values so the test is meaningful
    expect(theme.colors.primary.main).toBe('#32329f');
    expect(theme.colors.text.primary).toBe('#333333');

    // Split the source to find the h1 and h2 style blocks
    const lines = source.split('\n');
    let inH1 = false;
    let inH2 = false;
    let h1Color = '';
    let h2Color = '';

    for (const line of lines) {
      if (line.trim().startsWith('h1 {')) inH1 = true;
      if (line.trim().startsWith('h2 {')) inH2 = true;

      if (inH1 && line.includes('color:') && line.includes('colors.')) {
        h1Color = line.trim();
        inH1 = false;
      }
      if (inH2 && line.includes('color:') && line.includes('colors.')) {
        h2Color = line.trim();
        inH2 = false;
      }
    }

    // Both should use text.primary
    expect(h1Color).toContain('colors.text.primary');
    expect(h2Color).toContain('colors.text.primary');

    // Neither should use primary.main (the old incorrect value for h1)
    expect(h1Color).not.toContain('colors.primary.main');
    expect(h2Color).not.toContain('colors.primary.main');
  });
});
