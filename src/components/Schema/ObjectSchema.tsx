import { observer } from 'mobx-react';
import * as React from 'react';

import { SchemaModel } from '../../services/models';

import { PropertiesTable, PropertiesTableCaption } from '../../common-elements/fields-layout';
import { Field } from '../Fields/Field';
import { DiscriminatorDropdown } from './DiscriminatorDropdown';
import { SchemaProps } from './Schema';

import { mapWithLast } from '../../utils';
import { OptionsContext } from '../OptionsProvider';

export interface ObjectSchemaProps extends SchemaProps {
  discriminator?: {
    fieldName: string;
    parentSchema: SchemaModel;
  };
  fieldParentsName?: string[];
}

export const ObjectSchema = observer(
  ({
    schema: { fields = [], title },
    showTitle,
    discriminator,
    skipReadOnly,
    skipWriteOnly,
    level,
    fieldParentsName,
  }: ObjectSchemaProps) => {
    const { expandSingleSchemaField, showObjectSchemaExamples, schemasExpansionLevel } =
      React.useContext(OptionsContext);

    const filteredFields = React.useMemo(
      () =>
        skipReadOnly || skipWriteOnly
          ? fields.filter(
              item =>
                !(
                  (skipReadOnly && item.schema.readOnly) ||
                  (skipWriteOnly && item.schema.writeOnly)
                ),
            )
          : fields,
      [skipReadOnly, skipWriteOnly, fields],
    );

    const expandByDefault =
      (expandSingleSchemaField && filteredFields.length === 1) || schemasExpansionLevel >= level!;

    // The discriminator dropdown is normally attached to the field row whose name
    // matches the discriminator property. When the variant schemas don't declare that
    // property (e.g. a `oneOf` + `discriminator` written without `allOf` inheritance, as
    // commonly emitted by code generators), no field matches and the selector would
    // silently disappear, leaving only the first variant visible. In that case render the
    // dropdown standalone so the polymorphic variants stay switchable.
    const hasDiscriminatorField =
      !!discriminator && filteredFields.some(field => field.name === discriminator.fieldName);
    const showStandaloneDiscriminator = !!discriminator && !hasDiscriminatorField;

    const propertiesTable = (
      <PropertiesTable>
        {showTitle && <PropertiesTableCaption>{title}</PropertiesTableCaption>}
        <tbody>
          {mapWithLast(filteredFields, (field, isLast) => {
            return (
              <Field
                key={field.name}
                isLast={isLast}
                field={field}
                expandByDefault={expandByDefault}
                fieldParentsName={Number(level) > 1 ? fieldParentsName : []}
                renderDiscriminatorSwitch={
                  discriminator?.fieldName === field.name
                    ? () => (
                        <DiscriminatorDropdown
                          parent={discriminator!.parentSchema}
                          enumValues={field.schema.enum}
                        />
                      )
                    : undefined
                }
                className={field.expanded ? 'expanded' : undefined}
                showExamples={showObjectSchemaExamples}
                skipReadOnly={skipReadOnly}
                skipWriteOnly={skipWriteOnly}
                showTitle={showTitle}
                level={level}
              />
            );
          })}
        </tbody>
      </PropertiesTable>
    );

    if (!showStandaloneDiscriminator) {
      return propertiesTable;
    }

    return (
      <>
        <DiscriminatorDropdown
          parent={discriminator!.parentSchema}
          enumValues={discriminator!.parentSchema.oneOf?.map(s => s.title) ?? []}
        />
        {propertiesTable}
      </>
    );
  },
);
