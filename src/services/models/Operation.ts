import { action, observable, makeObservable } from 'mobx';

import {
  extractExtensions,
  getOperationSummary,
  getStatusCodeType,
  isStatusCode,
  memoize,
  mergeParams,
  normalizeServers,
  sortByField,
  sortByRequired,
} from '../../utils';

import { GroupModel } from './Group.model';
import { SecurityRequirementModel } from './SecurityRequirement';
import { CallbackModel } from './Callback';
import { FieldModel } from './Field';
import { RequestBodyModel } from './RequestBody';
import { ResponseModel } from './Response';
import { SideNavStyleEnum } from '../types';

import type {
  OpenAPIExternalDocumentation,
  OpenAPIServer,
  OpenAPIXBadges,
  OpenAPIXCodeSample,
} from '../../types';
import type { OpenAPIParser } from '../OpenAPIParser';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import type { MediaContentModel } from './MediaContent';
import type { ContentItemModel, ExtendedOpenAPIOperation, IMenuItem } from '../types';

export interface XPayloadSample {
  lang: 'payload';
  label: string;
  requestBodyContent: MediaContentModel;
  source: string;
}

export function isPayloadSample(
  sample: XPayloadSample | OpenAPIXCodeSample,
): sample is XPayloadSample {
  return sample.lang === 'payload' && (sample as any).requestBodyContent;
}

let isCodeSamplesWarningPrinted = false;

/**
 * Operation model ready to be used by components
 */
export class OperationModel implements IMenuItem {
  //#region IMenuItem fields
  id: string;
  absoluteIdx?: number;
  name: string;
  sidebarLabel: string;
  description?: string;
  type = 'operation' as const;

  parent?: GroupModel;
  externalDocs?: OpenAPIExternalDocumentation;
  items: ContentItemModel[] = [];

  depth: number;

  @observable
  ready?: boolean = true;
  @observable
  active: boolean = false;
  @observable
  expanded: boolean = false;
  //#endregion

  pointer: string;
  operationId?: string;
  operationHash?: string;
  httpVerb: string;
  badges: OpenAPIXBadges[];
  deprecated: boolean;
  path: string;
  servers: OpenAPIServer[];
  security: SecurityRequirementModel[];
  extensions: Record<string, any>;
  isCallback: boolean;
  isWebhook: boolean;
  isEvent: boolean;

  constructor(
    private parser: OpenAPIParser,
    private operationSpec: ExtendedOpenAPIOperation,
    parent: GroupModel | undefined,
    private options: RedocNormalizedOptions,
    isCallback: boolean = false,
  ) {
    makeObservable(this);

    this.pointer = operationSpec.pointer;

    this.description = operationSpec.description;
    this.parent = parent;
    this.externalDocs = operationSpec.externalDocs;

    this.deprecated = !!operationSpec.deprecated;
    this.httpVerb = operationSpec.httpVerb;
    this.deprecated = !!operationSpec.deprecated;
    this.operationId = operationSpec.operationId;
    this.path = operationSpec.pathName;
    this.isCallback = isCallback;
    this.isWebhook = operationSpec.isWebhook;
    this.isEvent = this.isCallback || this.isWebhook;

    this.name = getOperationSummary(operationSpec);

    this.sidebarLabel =
      options.sideNavStyle === SideNavStyleEnum.IdOnly
        ? this.operationId || this.path
        : options.sideNavStyle === SideNavStyleEnum.PathOnly
        ? this.path
        : this.name;
    this.badges =
      operationSpec['x-badges']?.map(({ name, color, position }) => ({
        name,
        color: color,
        position: position || 'after',
      })) || [];

    if (this.isCallback) {
      // NOTE: Callbacks by default should not inherit the specification's global `security` definition.
      // Can be defined individually per-callback in the specification. Defaults to none.
      this.security = (operationSpec.security || []).map(
        security => new SecurityRequirementModel(security, parser),
      );

      // TODO: update getting pathInfo for overriding servers on path level
      this.servers = normalizeServers('', operationSpec.servers || operationSpec.pathServers || []);
    } else {
      this.operationHash = operationSpec.operationId && 'operation/' + operationSpec.operationId;
      this.id =
        operationSpec.operationId !== undefined
          ? (parent ? parent.id + '/' : '') + this.operationHash
          : parent !== undefined
          ? parent.id + this.pointer
          : this.pointer;

      this.security = (operationSpec.security || parser.spec.security || []).map(
        security => new SecurityRequirementModel(security, parser),
      );

      this.servers = normalizeServers(
        parser.specUrl,
        operationSpec.servers || operationSpec.pathServers || parser.spec.servers || [],
      );
    }

    if (options.showExtensions) {
      this.extensions = extractExtensions(operationSpec, options.showExtensions);
    }
  }

  /**
   * set operation as active (used by side menu)
   */
  @action
  activate() {
    this.active = true;
  }

  /**
   * set operation as inactive (used by side menu)
   */
  @action
  deactivate() {
    this.active = false;
  }

  /**
   * Toggle expansion in middle panel (for callbacks, which are operations)
   */
  @action
  toggle() {
    this.expanded = !this.expanded;
  }

  expand() {
    if (this.parent) {
      this.parent.expand();
    }
  }

  collapse() {
    /* do nothing */
  }

  @memoize
  get requestBody() {
    return (
      this.operationSpec.requestBody &&
      new RequestBodyModel({
        parser: this.parser,
        infoOrRef: this.operationSpec.requestBody,
        options: this.options,
        isEvent: this.isEvent,
      })
    );
  }

  @memoize
  get codeSamples() {
    const { payloadSampleIdx, hideRequestPayloadSample } = this.options;
    let samples: Array<OpenAPIXCodeSample | XPayloadSample> =
      this.operationSpec['x-codeSamples'] || this.operationSpec['x-code-samples'] || [];

    if (this.operationSpec['x-code-samples'] && !isCodeSamplesWarningPrinted) {
      isCodeSamplesWarningPrinted = true;
      console.warn('"x-code-samples" is deprecated. Use "x-codeSamples" instead');
    }

    const requestBodyContent = this.requestBody && this.requestBody.content;
    if (requestBodyContent && requestBodyContent.hasSample && !hideRequestPayloadSample) {
      const insertInx = Math.min(samples.length, payloadSampleIdx);

      samples = [
        ...samples.slice(0, insertInx),
        {
          lang: 'payload',
          label: 'Payload',
          source: '',
          requestBodyContent,
        },
        ...samples.slice(insertInx),
      ];
    }

    return samples;
  }

  @memoize
  get parameters() {
    const _parameters = mergeParams(
      this.parser,
      this.operationSpec.pathParameters,
      this.operationSpec.parameters,
      // TODO: fix pointer
    ).map(paramOrRef => new FieldModel(this.parser, paramOrRef, this.pointer, this.options));

    if (this.options.sortPropsAlphabetically) {
      return sortByField(_parameters, 'name');
    }
    if (this.options.sortRequiredPropsFirst) {
      return sortByRequired(_parameters);
    }

    return _parameters;
  }

  @memoize
  get responses() {
    let hasSuccessResponses = false;
    return Object.keys(this.operationSpec.responses || [])
      .filter(code => {
        if (code === 'default') {
          return true;
        }

        if (getStatusCodeType(code) === 'success') {
          hasSuccessResponses = true;
        }

        return isStatusCode(code);
      }) // filter out other props (e.g. x-props)
      .map(code => {
        return new ResponseModel({
          parser: this.parser,
          code,
          defaultAsError: hasSuccessResponses,
          infoOrRef: this.operationSpec.responses[code],
          options: this.options,
          isEvent: this.isEvent,
        });
      });
  }

  @memoize
  get callbacks() {
    return Object.keys(this.operationSpec.callbacks || []).map(callbackEventName => {
      return new CallbackModel(
        this.parser,
        callbackEventName,
        this.operationSpec.callbacks![callbackEventName],
        this.pointer,
        this.options,
      );
    });
  }
}
