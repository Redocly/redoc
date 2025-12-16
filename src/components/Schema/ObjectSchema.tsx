import { memo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { ObjectSchemaProps } from './types.js';

import { PropertiesTableCaption } from '../common/index.js';
import { Discriminator } from '../Discriminator/index.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { PropertyDetails } from '../PropertyDetails/index.js';
import { SubSchema } from './SubSchema.js';
import { getExpandByDefault } from './helpers.js';
import { useTranslate } from '../../hooks/index.js';
import { ArrayClosingLabel, LabelValue } from '../common/styled.js';

function ObjectSchemaComponent({
  schema,
  showTitle,
  discriminator,
  level,
  skipWriteOnly,
  skipReadOnly,
  fieldParentsName,
  expandable,
  deepLink,
  required,
  disableDeepLinks,
  shouldCloseArray,
  oneOfLevel,
  slug,
  onOneOfChange,
}: ObjectSchemaProps): ReactElement {
  const { fields = [], title } = schema;
  const translate = useTranslate();
  const { schemasExpansionLevel } = useAtomValue(globalOptionsAtom);

  const filteredFields =
    skipReadOnly || skipWriteOnly
      ? fields.filter(
          (item) =>
            !((skipReadOnly && item.schema.readOnly) || (skipWriteOnly && item.schema.writeOnly)),
        )
      : fields;

  const expandByDefault = getExpandByDefault({
    required,
    level,
    schemasExpansionLevel,
  });

  return (
    <SubSchema
      expandable={expandable}
      expandByDefault={expandByDefault}
      level={level}
      propertyLength={filteredFields.length}
      deepLink={deepLink}
      operationPointer={schema.operationPointer}
    >
      <>
        {showTitle && <PropertiesTableCaption>{title}</PropertiesTableCaption>}
        {filteredFields.map((field, index) => (
          <PropertyDetails
            key={field.name}
            isFirst={index === 0}
            field={field}
            fieldParentsName={Number(level) > 1 ? fieldParentsName : []}
            renderDiscriminatorSwitch={
              discriminator?.fieldName === field.name && discriminator?.parentSchema
                ? () => (
                    <Discriminator
                      parent={discriminator.parentSchema}
                      onChange={discriminator?.onChange}
                      activeOneOfIdx={discriminator.activeOneOfIdx}
                      translate={translate}
                    />
                  )
                : undefined
            }
            skipReadOnly={skipReadOnly}
            skipWriteOnly={skipWriteOnly}
            showTitle={showTitle}
            level={level}
            disableDeepLinks={disableDeepLinks}
            oneOfLevel={oneOfLevel}
            slug={slug}
            onOneOfChange={onOneOfChange}
          />
        ))}
      </>
      {shouldCloseArray && (
        <ArrayClosingLabel className="array-closing-label">
          <LabelValue>]</LabelValue>
        </ArrayClosingLabel>
      )}
    </SubSchema>
  );
}

export const ObjectSchema = memo<ObjectSchemaProps>(ObjectSchemaComponent);
