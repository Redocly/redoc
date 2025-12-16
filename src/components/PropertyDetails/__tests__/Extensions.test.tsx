import { render } from '@testing-library/react';
import * as Jotai from 'jotai';

import { Extensions } from '../Extensions.js';
import { normalizeOptions } from '../../../services/index.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('Components', () => {
  describe('Extensions', () => {
    it('Extensions label renders correctly', () => {
      vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(
        normalizeOptions({
          showExtensions: true,
        }),
      );

      const { container } = render(
        <Extensions extensions={{ 'x-test': 'Add new pet to the store inventory' }} />,
      );

      expect(container).toHaveTextContent(/test: Add new pet to the store inventory/);
    });
  });
});
