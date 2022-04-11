import * as React from 'react';

import { FieldLabel, ExampleValue } from '../../common-elements/fields';
import { getSerializedValue } from '../../utils';

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
      <ExamplesList>
        {Object.values(field.examples).map((example, idx) => {
          return (
            <li key={idx}>
              <ExampleValue>{getSerializedValue(field, example.value)}</ExampleValue> -{' '}
              {example.summary || example.description}
            </li>
          );
        })}
      </ExamplesList>
    </>
  );
}

const ExamplesList = styled.ul`
  margin-top: 1em;
  padding-left: 0;
  list-style-position: inside;
`;
