import type { ReactElement } from 'react';
import type { FieldModel, RequestBodyModel } from '../../models/index.js';

import { ParametersGroup } from './ParametersGroup.js';
import { Body } from './Body.js';
import { makeDeepLink } from '../../services/index.js';
import { useTranslate } from '../../hooks/index.js';

export interface ParametersProps {
  parameters?: FieldModel[];
  body?: RequestBodyModel;
  operationId: string;
  callbackId: string;
}

const PARAM_PLACES = ['path', 'query', 'cookie', 'header'];

export function RequestParameters({
  body,
  parameters = [],
  operationId,
  callbackId,
}: ParametersProps): ReactElement | null {
  const translate = useTranslate();
  if (!body && !parameters.length) {
    return null;
  }

  const PARAM_NAMES_MAP = {
    [PARAM_PLACES[0]]: translate('openapi.path', 'Path'),
    [PARAM_PLACES[1]]: translate('openapi.query', 'Query'),
    [PARAM_PLACES[2]]: translate('openapi.cookie', 'Cookies'),
    [PARAM_PLACES[3]]: translate('openapi.header', 'Headers'),
  };

  const orderParams = (params: FieldModel[]): Record<string, FieldModel[]> => {
    const res = {};
    params.forEach((param) => {
      safePush(res, param.in, param);
    });
    return res;
  };

  const paramsMap = orderParams(parameters);

  const paramsPlaces = parameters.length > 0 ? PARAM_PLACES : [];

  const { content: bodyContent, description: bodyDescription, required } = body || {};

  return (
    <>
      {paramsPlaces.map((place) => (
        <ParametersGroup
          key={place}
          title={PARAM_NAMES_MAP[place]}
          parameters={paramsMap[place]}
          deepLink={generateDeepLink(operationId, callbackId, place)}
        />
      ))}
      {bodyContent && (
        <Body
          content={bodyContent}
          description={bodyDescription}
          required={required}
          deepLink={generateDeepLink(operationId, callbackId)}
        />
      )}
    </>
  );
}

function safePush(obj: GenericObject, prop: string = '', item: FieldModel): void {
  if (!obj[prop]) {
    obj[prop] = [];
  }
  obj[prop].push(item);
}

function generateDeepLink(operationId: string, callbackId: string, place = 'body'): string {
  const suffix = `${callbackId ? `${callbackId}/request/${place}` : `request/${place}`}`;
  return makeDeepLink(operationId, suffix);
}
