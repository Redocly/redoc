import { action, computed, observable, makeObservable } from 'mobx';

import type { OpenAPIMediaType } from '../../types';
import { MediaTypeModel } from './MediaType';

import { mergeSimilarMediaTypes } from '../../utils';
import type { OpenAPIParser } from '../OpenAPIParser';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';

/**
 * MediaContent model ready to be sued by React components
 * Contains multiple MediaTypes and keeps track of the currently active one
 */
export class MediaContentModel {
  mediaTypes: MediaTypeModel[];

  @observable
  activeMimeIdx = 0;

  /**
   * @param isRequestType needed to know if skipe RO/RW fields in objects
   */
  constructor(
    parser: OpenAPIParser,
    info: Record<string, OpenAPIMediaType>,
    public isRequestType: boolean,
    options: RedocNormalizedOptions,
  ) {
    makeObservable(this);

    if (options.unstable_ignoreMimeParameters) {
      info = mergeSimilarMediaTypes(info);
    }
    this.mediaTypes = Object.keys(info).map(name => {
      const mime = info[name];
      // reset deref cache just in case something is left there
      return new MediaTypeModel(parser, name, isRequestType, mime, options);
    });
  }

  /**
   * Set active media type by index
   * @param idx media type index
   */
  @action
  activate(idx: number) {
    this.activeMimeIdx = idx;
  }

  @computed
  get active() {
    return this.mediaTypes[this.activeMimeIdx];
  }

  get hasSample(): boolean {
    return this.mediaTypes.filter(mime => !!mime.examples).length > 0;
  }
}
