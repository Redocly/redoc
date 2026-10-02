import { describe, it, expect } from 'vitest';

import type { AsyncApiChannel } from '../../../../types/asyncapi.js';

import { getChannelLabel } from '../get-channel-label.js';

function channel(value: unknown): AsyncApiChannel {
  return value as AsyncApiChannel;
}

describe('getChannelLabel', () => {
  it('follows the title → summary → address → key fallback chain', () => {
    expect(
      getChannelLabel(channel({ title: 'Title', summary: 'Summary', address: '/addr' }), 'key'),
    ).toBe('Title');
    expect(getChannelLabel(channel({ summary: 'Summary', address: '/addr' }), 'key')).toBe(
      'Summary',
    );
    expect(getChannelLabel(channel({ address: '/addr' }), 'key')).toBe('/addr');
    expect(getChannelLabel(channel({}), 'key')).toBe('key');
  });

  it('falls back to the key when every label field is undefined or empty', () => {
    expect(
      getChannelLabel(channel({ title: undefined, summary: undefined, address: undefined }), 'key'),
    ).toBe('key');
    expect(getChannelLabel(channel({ title: '', summary: '', address: '' }), 'key')).toBe('key');
  });

  it('skips non-string label fields', () => {
    expect(getChannelLabel(channel({ title: { en: 'Title' }, summary: 'Summary' }), 'key')).toBe(
      'Summary',
    );
    expect(getChannelLabel(channel({ summary: { en: 'Summary' } }), 'key')).toBe('key');
  });

  it('returns the key when the channel itself is missing', () => {
    expect(getChannelLabel(undefined, 'key')).toBe('key');
  });
});
