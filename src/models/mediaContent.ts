import type { MediaContentModel, MediaContentModelInput } from './types.js';

import { getMediaType } from './mediaType.js';

/**
 * MediaContent model ready to be sued by React components
 * Contains multiple MediaTypes and keeps track of the currently active one
 */
export function getMediaContent({
  parser,
  info,
  isRequestType,
  options,
  data: { operation, type, response, absolutePointer = '' },
}: MediaContentModelInput): MediaContentModel {
  const mediaTypes = Object.keys(info).map((name) =>
    getMediaType(parser, name, isRequestType, info[name], options, {
      operation,
      type,
      response,
      absolutePointer,
    }),
  );

  const hasSample = mediaTypes.filter((mime) => !!mime.examples || !!mime.formExamples).length > 0;

  return {
    mediaTypes,
    isRequestType,
    hasSample,
    operation,
  };
}

export function getActiveMediaType(content: MediaContentModel, activeMimeName?: string) {
  const mediaType =
    (activeMimeName && content.mediaTypes.find((type) => type.name === activeMimeName)) ||
    content.mediaTypes[0];

  return mediaType || {};
}
