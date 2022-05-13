import * as React from 'react';

import { FieldLabel, ExampleValue } from '../../common-elements/fields';
import { getSerializedValue, isArray } from '../../utils';

import { l } from '../../services/Labels';
import { FieldModel } from '../../services';
import styled from '../../styled-components';

export function Examples({ field }: { field: FieldModel }) {
  if (!field.examples) {
    return null;
  }

  return (
    <>
      <FieldLabel> {l('examples')}: </FieldLabel>
      {isArray(field.examples) ? (
        field.examples.map((example, idx) => {
          const value = getSerializedValue(field, example);
          const stringifyValue = field.in ? String(value) : JSON.stringify(value);
          return (
            <React.Fragment key={idx}>
              <ExampleValue>{stringifyValue}</ExampleValue>{' '}
            </React.Fragment>
          );
        })
      ) : (
        <ExamplesList>
          {Object.values(field.examples).map((example, idx) => (
            <li key={idx + example.value}>
              <ExampleValue>{getSerializedValue(field, example.value)}</ExampleValue> -{' '}
              {example.summary || example.description}
            </li>
          ))}
        </ExamplesList>
      )}
    </>
  );
}

const ExamplesList = styled.ul`
  margin-top: 1em;
  list-style-position: outside;
`;
