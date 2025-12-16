import { render, fireEvent, screen } from '@testing-library/react';

import { LanguageDropdown } from '../LanguageDropdown.js';

const mockSamples = [
  { key: 'js', title: 'JS', lang: 'js' },
  { key: 'node.js', title: 'Node.JS', lang: 'nodejs' },
];

const mockActiveTab = mockSamples[0].key;

const mockOnChange = vi.fn();

describe('LanguageDropdown', () => {
  test('LanguageDropdown renders correctly', () => {
    const { getAllByText } = render(
      <LanguageDropdown samples={mockSamples} activeTab={mockActiveTab} onChange={mockOnChange} />,
    );

    expect(getAllByText(mockSamples[0].title)[0]).toBeInTheDocument();
  });

  test('LanguageDropdown handles onChange correctly', () => {
    const { getAllByText } = render(
      <LanguageDropdown samples={mockSamples} activeTab={mockActiveTab} onChange={mockOnChange} />,
    );

    fireEvent.click(screen.getAllByText(mockSamples[0].title)[0]);

    const otherLanguage = mockSamples[1];
    fireEvent.click(getAllByText(otherLanguage.title)[0]);

    expect(mockOnChange).toHaveBeenCalledWith(otherLanguage.key);
  });
});
