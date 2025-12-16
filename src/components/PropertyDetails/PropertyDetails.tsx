import { memo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { FieldProps } from './types.js';

import { Schema } from '../Schema/index.js';
import { FieldDetails } from './FieldDetails.js';
import { generateDeepLink } from '../common/LinkToField.js';
import { activeMimeNameAtom } from '../../jotai/app.js';
import { styled } from '../../styled-components.js';

function PropertyDetailsComponent({
  field,
  skipWriteOnly,
  skipReadOnly,
  level = 1,
  showTitle,
  renderDiscriminatorSwitch,
  isFirst,
  fieldParentsName,
  disableDeepLinks,
  oneOfLevel,
  slug,
  onOneOfChange,
}: FieldProps): ReactElement {
  const activeMimeName = useAtomValue(activeMimeNameAtom);

  const generatedDeepLink = disableDeepLinks ? undefined : generateDeepLink(field, activeMimeName);
  const deepLink =
    slug && generatedDeepLink ? `${slug}&${generatedDeepLink.replace('#', '')}` : generatedDeepLink;
  const withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;

  return (
    <Wrapper isFist={isFirst} expanded={withSubSchema} className="property">
      <FieldDetails
        field={field}
        renderDiscriminatorSwitch={renderDiscriminatorSwitch}
        deepLink={deepLink}
        fieldParentsName={fieldParentsName}
      />
      {withSubSchema && (
        <Schema
          schema={field.schema}
          skipReadOnly={skipReadOnly}
          skipWriteOnly={skipWriteOnly}
          showTitle={showTitle}
          expandable={true}
          level={level + 1}
          fieldParentsName={[...(fieldParentsName || []), field.name]}
          deepLink={deepLink}
          required={field.required}
          disableDeepLinks={disableDeepLinks}
          oneOfLevel={oneOfLevel}
          slug={slug}
          onOneOfChange={onOneOfChange}
        />
      )}
    </Wrapper>
  );
}

export const PropertyDetails = memo<FieldProps>(PropertyDetailsComponent);

const Wrapper = styled.div<{ expanded?: boolean; isFist?: boolean }>`
  width: 100%;
  padding: ${({ isFist }) => `var(--schema-${isFist ? 'fist-' : ''}property-details-spacing)`} 0
    ${({ expanded }) => (expanded ? 0 : 'var(--schema-property-details-spacing)')};
  ${({ expanded }) => !expanded && 'border-bottom: 1px solid var(--border-color-primary)'};

  // This styles needs to override the dividers when array closing label is present
  &:has(+ span.array-closing-label) {
    border-bottom: none;
    padding-bottom: calc(var(--schema-property-details-spacing) / 2);

    .view-nested-wrapper {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
`;
