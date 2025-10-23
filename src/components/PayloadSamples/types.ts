import type { ExampleModel, MediaContentModel, MediaTypeModel } from '../../models/index.js';
import type { OpenAPIEncoding } from '../../types/index.js';

export interface ExampleProps extends Pick<MediaTypeSamplesProps, 'onCopyClick'> {
  example: ExampleModel;
  mimeType: string;
}

export interface ExampleValueProps extends Pick<MediaTypeSamplesProps, 'onCopyClick'> {
  value: GenericObject | string;
  mimeType: string;
  encoding?: { [field: string]: OpenAPIEncoding };
}

export interface MediaTypeSamplesProps {
  mediaType: MediaTypeModel;
  properties?: GenericObject;
  onChange: (key) => void;
  onCopyClick?: () => void;
}

export interface PayloadSamplesProps
  extends Pick<MediaTypeSamplesProps, 'properties' | 'onCopyClick'> {
  content: MediaContentModel;
  onlyDefaultMimeType?: boolean;
}
