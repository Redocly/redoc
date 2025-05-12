import * as React from 'react';
import { ExampleValue, FieldLabel } from '../../common-elements/fields';

import { l } from '../../services/Labels';
import { OptionsContext } from '../OptionsProvider';
import styled from '../../styled-components';
import { RedocRawOptions } from '../../services/RedocNormalizedOptions';
import { StyledMarkdownBlock } from '../Markdown/styled.elements';
import { Markdown } from '../Markdown/Markdown';

export interface EnumValuesProps {
  values?: string[] | { [name: string]: string };
  type: string | string[];
}

export interface EnumValuesState {
  collapsed: boolean;
}

const DescriptionEnumsBlock = styled(StyledMarkdownBlock)`
  table {
    margin-bottom: 0.2em;
  }
`;

export class EnumValues extends React.PureComponent<EnumValuesProps, EnumValuesState> {
  constructor(props: EnumValuesProps) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  state: EnumValuesState = {
    collapsed: true,
  };

  static contextType = OptionsContext;

  private toggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const { values, type } = this.props;
    const { collapsed } = this.state;
    const isDescriptionEnum = !Array.isArray(values);
    const enums =
      (Array.isArray(values) && values) ||
      Object.entries(values || {}).map(([value, description]) => ({
        value,
        description,
      }));

    // TODO: provide context interface in more elegant way
    const { enumSkipQuotes, maxDisplayedEnumValues } = this.context as RedocRawOptions;

    if (!enums.length) {
      return null;
    }

    const displayedItems =
      this.state.collapsed && maxDisplayedEnumValues
        ? enums.slice(0, maxDisplayedEnumValues)
        : enums;

    const showToggleButton = maxDisplayedEnumValues ? enums.length > maxDisplayedEnumValues : false;

    const toggleButtonText = maxDisplayedEnumValues
      ? collapsed
        ? `… ${enums.length - maxDisplayedEnumValues} more`
        : 'Hide'
      : '';

    return (
      <div>
        {isDescriptionEnum ? (
          <>
            <DescriptionEnumsBlock>
              <table>
                <thead>
                  <tr>
                    <th>
                      <FieldLabel>
                        {type === 'array' ? l('enumArray') : ''}{' '}
                        {enums.length === 1 ? l('enumSingleValue') : l('enum')}
                      </FieldLabel>{' '}
                    </th>
                    <th>
                      <strong>Description</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(displayedItems as { value: string; description: string }[]).map(
                    ({ description, value }) => {
                      return (
                        <tr key={value}>
                          <td>{value}</td>
                          <td>
                            <Markdown source={description} compact inline />
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </DescriptionEnumsBlock>
            {showToggleButton ? (
              <ToggleButton onClick={this.toggle}>{toggleButtonText}</ToggleButton>
            ) : null}
          </>
        ) : (
          <>
            <FieldLabel>
              {type === 'array' ? l('enumArray') : ''}{' '}
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
              <ToggleButton onClick={this.toggle}>{toggleButtonText}</ToggleButton>
            ) : null}
          </>
        )}
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
