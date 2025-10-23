import { memo } from 'react';
import { useAtomValue } from 'jotai/index';

import type { PropsWithChildren } from 'react';

import { pathIncludesLink } from '../../utils/index.js';
import { operationStore } from '../../jotai/operation.js';
import { extractTypeFromDeepLink } from './helpers.js';
import { ViewNested } from '../ViewNested/index.js';
import { useTranslate } from '../../hooks/index.js';
import { useLocation } from '../../hooks/useLocation.js';

interface SubSchemaProps {
  expandByDefault: boolean;
  deepLink?: string;
  level?: number;
  openByDefault?: boolean;
  expandable?: boolean;
  isArray?: boolean | string;
  isNestedArray?: boolean;
  propertyLength?: number | string;
  operationPointer?: string;
}

function SubSchemaComponent({
  expandByDefault,
  deepLink,
  level,
  expandable = false,
  isNestedArray = false,
  isArray = '',
  propertyLength = '',
  children,
  operationPointer,
}: PropsWithChildren<SubSchemaProps>) {
  const translate = useTranslate();
  const location = useLocation();
  const expandByLocation = pathIncludesLink(location, deepLink);

  const type = extractTypeFromDeepLink(deepLink);
  const operationState = useAtomValue(operationStore(operationPointer || ''));

  const expandText = `${translate('openapi.actions.show', 'Show')} ${
    Number(propertyLength) === 1 ? '' : propertyLength
  } ${isArray && 'array '}${propertyLength !== 1 ? 'properties' : 'property'}`;

  return (
    <ViewNested
      expandByDefault={expandByDefault || expandByLocation}
      level={level}
      isNestedArray={isNestedArray}
      expandable={expandable}
      expandText={expandText}
      children={children}
      expandedAll={operationState[type]?.expandedAll}
    />
  );
}

export const SubSchema = memo<PropsWithChildren<SubSchemaProps>>(SubSchemaComponent);
