import { render } from '@testing-library/react';
import * as Jotai from 'jotai';

import { Extensions } from '../Extensions';
import { normalizeOptions } from '../../../services';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

describe('Components', () => {
  describe('Extensions', () => {
    it('Extensions label renders correctly', () => {
      jest.spyOn(Jotai, 'useAtomValue').mockReturnValue(
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
