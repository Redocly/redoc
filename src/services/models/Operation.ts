import { observable, action } from 'mobx';
import { join as joinPaths } from 'path';
import { parse as urlParse } from 'url';

import { IMenuItem } from '../MenuStore';
import { GroupModel } from './Group.model';

import { OpenAPIExternalDocumentation, OpenAPIServer } from '../../types';

import { FieldModel } from './Field';
import { ResponseModel } from './Response';
import { RequestBodyModel } from './RequestBody';
import { CodeSample } from './types';
import { OpenAPIParser } from '../OpenAPIParser';
import { ContentItemModel, ExtendedOpenAPIOperation } from '../MenuBuilder';
import { JsonPointer, getOperationSummary, isAbsolutePath, stripTrailingSlash } from '../../utils';

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Operation model ready to be used by components
 */
export class OperationModel implements IMenuItem {
  //#region IMenuItem fields
  id: string;
  absoluteIdx?: number;
  name: string;
  description?: string;
  type = 'operation' as 'operation';

  parent?: GroupModel;
  externalDocs?: OpenAPIExternalDocumentation;
  items: Array<ContentItemModel> = [];

  depth: number;

  @observable ready?: boolean = true;
  @observable active: boolean = false;
  //#endregion

  _$ref: string;
  operationId?: string;
  httpVerb: string;
  deprecated: boolean;
  requestBody?: RequestBodyModel;
  parameters: FieldModel[];
  responses: ResponseModel[];
  path: string;
  servers: OpenAPIServer[];
  codeSamples: CodeSample[];

  constructor(parser: OpenAPIParser, operationSpec: ExtendedOpenAPIOperation, parent?: GroupModel) {
    this.id = operationSpec._$ref;
    this.name = getOperationSummary(operationSpec);
    this.description = operationSpec.description;

    this.parent = parent;
    this.externalDocs = operationSpec.externalDocs;

    this._$ref = operationSpec._$ref;
    this.deprecated = !!operationSpec.deprecated;
    this.httpVerb = operationSpec.httpVerb;
    this.deprecated = !!operationSpec.deprecated;
    this.operationId = operationSpec.operationId;
    this.requestBody =
      operationSpec.requestBody && new RequestBodyModel(parser, operationSpec.requestBody);
    this.codeSamples = operationSpec['x-code-samples'] || [];
    this.path = JsonPointer.baseName(this._$ref, 2);

    this.parameters = (operationSpec.parameters || []).map(
      paramOrRef => new FieldModel(parser, paramOrRef, this._$ref),
    );

    this.responses = Object.keys(operationSpec.responses || [])
      .filter(code => isNumeric(code) || code === 'default') // filter out other props (e.g. x-props)
      .map(code => new ResponseModel(parser, code, operationSpec.responses[code]));

    this.servers = normalizeServers(
      parser.specUrl,
      operationSpec.servers || parser.spec!.servers || [],
    );
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

  getHash() {
    return this.operationId !== undefined
      ? 'operation/' + this.operationId
      : this.parent !== undefined ? this.parent.id + this.id : this.id;
  }
}

function normalizeServers(specUrl: string, servers: OpenAPIServer[]): OpenAPIServer[] {
  if (servers.length === 0) {
    return [
      {
        url: specUrl,
      },
    ];
  }

  function normalizeUrl(url: string): string {
    url = isAbsolutePath(url) ? url : joinPaths(specUrl, url);
    return stripTrailingSlash(url.startsWith('//') ? `${specProtocol}${url}` : url);
  }

  const { protocol: specProtocol } = urlParse(specUrl);

  return servers.map(server => {
    return {
      ...server,
      url: normalizeUrl(server.url),
      description: server.description || '',
    };
  });
}
