import * as React from 'react';
import { ExampleValue, FieldLabel } from '../../common-elements/fields';

import { l } from '../../services/Labels';
import { OptionsContext } from '../OptionsProvider';
import styled from '../../styled-components';
import { RedocRawOptions } from '../../services/RedocNormalizedOptions';

export interface EnumValuesProps {
  values: string[];
  isArrayType: boolean;
}

export interface EnumValuesState {
  collapsed: boolean;
}

export class EnumValues extends React.PureComponent<EnumValuesProps, EnumValuesState> {
  state: EnumValuesState = {
    collapsed: true,
  };

  static contextType = OptionsContext;

  private toggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const { values, isArrayType } = this.props;
    const { collapsed } = this.state;

    // TODO: provide context interface in more elegant way
    const { enumSkipQuotes, maxDisplayedEnumValues } = this.context as RedocRawOptions;

    if (!values.length) {
      return null;
    }

    const displayedItems =
      this.state.collapsed && maxDisplayedEnumValues
        ? values.slice(0, maxDisplayedEnumValues)
        : values;

    const showToggleButton = maxDisplayedEnumValues
      ? values.length > maxDisplayedEnumValues
      : false;

    const toggleButtonText = maxDisplayedEnumValues
      ? collapsed
        ? `… ${values.length - maxDisplayedEnumValues} more`
        : 'Hide'
      : '';

    return (
      <div>
        <FieldLabel>
          {isArrayType ? l('enumArray') : ''}{' '}
          {values.length === 1 ? l('enumSingleValue') : l('enum')}:
        </FieldLabel>{' '}
        {displayedItems.map((value, idx) => {
          const exampleValue = enumSkipQuotes ? String(value) : JSON.stringify(value);
          return (
            <React.Fragment key={idx}>
              <ExampleValue>{exampleValue}</ExampleValue>{' '}
            </React.Fragment>
          );
        })}
        {showToggleButton ? (
          <ToggleButton
            onClick={() => {
              this.toggle();
            }}
          >
            {toggleButtonText}
          </ToggleButton>
        ) : null}
      </div>
    );
  }
}

const ToggleButton = styled.span`
  color: ${props => props.theme.colors.primary.main};
  vertical-align: middle;
  font-size: 13px;
  line-height: 20px;
  padding: 0 5px;
  cursor: pointer;
`;
