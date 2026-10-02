import type { AsyncApiChannel } from '../../../types/asyncapi.js';

import { asString } from '../../../utils/string.js';

/** Shared by the nav item, the page header and message references so all three stay in sync. */
export function getChannelLabel(channel: AsyncApiChannel | undefined, channelId: string): string {
  return (
    asString(channel?.title) ??
    asString(channel?.summary) ??
    asString(channel?.address) ??
    channelId
  );
}
