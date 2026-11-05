import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import '@testing-library/jest-dom/vitest';

import { Modal } from '../Modal.js';

function Host() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Modal icon={null} title="Details" onClose={() => setOpen(false)}>
          <p>Body</p>
        </Modal>
      )}
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe('Modal', () => {
  it('returns focus to the opener after Escape, also under StrictMode', () => {
    render(
      <StrictMode>
        <Host />
      </StrictMode>,
    );
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });
});
