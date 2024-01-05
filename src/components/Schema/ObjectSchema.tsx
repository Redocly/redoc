import { observer } from 'mobx-react';
import * as React from 'react';

import styled from '../../styled-components';
import { H3 } from '../../common-elements/headers';
import { Markdown } from '../Markdown/Markdown';

import { SchemaModel } from '../../services/models';

import { PropertiesTable } from '../../common-elements/fields-layout';
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
}

export const ObjectSchemaDetails = styled.div`
  margin: 0 0 0.5em 0;
`;

export const ObjectSchemaTitle = styled(H3)`
  margin: 0.5em 0 0 0;
`;

export const ObjectSchemaDescription = styled.div`
  margin: 0.5em 0 0 0;
`;

export const ObjectSchema = observer(
  ({
    schema: { fields = [], title, description },
    discriminator,
    skipReadOnly,
    skipWriteOnly,
    hideObjectTitle,
    hideObjectDescription,
    level,
  }: ObjectSchemaProps) => {
    const { expandSingleSchemaField, showObjectSchemaExamples, schemaExpansionLevel } =
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
      (expandSingleSchemaField && filteredFields.length === 1) || schemaExpansionLevel >= level!;

    return (
      <div>
        <ObjectSchemaDetails>
          {!hideObjectTitle && <ObjectSchemaTitle>{title}</ObjectSchemaTitle>}
          {!hideObjectDescription && (
            <ObjectSchemaDescription>
              <Markdown compact={true} source={description} />
            </ObjectSchemaDescription>
          )}
        </ObjectSchemaDetails>

        <PropertiesTable>
          <tbody>
            {mapWithLast(filteredFields, (field, isLast) => {
              return (
                <Field
                  key={field.name}
                  isLast={isLast}
                  field={field}
                  expandByDefault={expandByDefault}
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
                  hideObjectTitle={hideObjectTitle}
                  hideObjectDescription={hideObjectDescription}
                  level={level}
                />
              );
            })}
          </tbody>
        </PropertiesTable>
      </div>
    );
  },
);
