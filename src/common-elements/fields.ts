import { transparentize } from 'polished';
import { palette } from '@leafygreen-ui/palette';

import styled, { extensionsHook, css } from '../styled-components';
import { PropertyNameCell } from './fields-layout';
import { ShelfIcon } from './shelfs';

export const ClickablePropertyNameCell = styled(PropertyNameCell)`
  button {
    background-color: transparent;
    border: 0;
    outline: 0;
    font-size: 13px;
    font-family: ${props => props.theme.typography.code.fontFamily};
    cursor: pointer;
    padding: 0;
    color: ${props => props.theme.colors.text.primary};
    &:focus {
      font-weight: ${({ theme }) => theme.typography.fontWeightBold};
    }
    ${({ kind }) =>
      kind === 'patternProperties' &&
      css`
        display: inline-flex;
        margin-right: 20px;

        > span.property-name {
          white-space: break-spaces;
          text-align: left;

          ::before,
          ::after {
            content: '/';
            filter: opacity(0.2);
          }
        }

        > svg {
          align-self: center;
        }
      `}
  }
  ${ShelfIcon} {
    height: ${({ theme }) => theme.schema.arrow.size};
    width: ${({ theme }) => theme.schema.arrow.size};
    polygon {
      fill: ${({ theme }) => theme.schema.arrow.color};
    }
  }
`;

export const FieldLabel = styled.span`
  vertical-align: middle;
  font-size: ${({ theme }) => theme.typography.code.fontSize};
  line-height: 20px;
`;

export const TypePrefix = styled(FieldLabel)`
  color: ${props => transparentize(0.1, props.theme.schema.typeNameColor)};
`;

export const TypeName = styled(FieldLabel)`
  color: ${props => props.theme.schema.typeNameColor};
`;

export const TypeTitle = styled(FieldLabel)`
  color: ${props => props.theme.schema.typeTitleColor};
  word-break: break-word;
`;

export const TypeFormat = TypeName;

export const RequiredLabel = styled(FieldLabel.withComponent('div'))`
  color: ${props => props.theme.schema.requireLabelColor};
  font-size: ${props => props.theme.schema.labelsTextSize};
  font-weight: normal;
  margin-left: 20px;
  line-height: 1;
`;

export const PropertyLabel = styled(RequiredLabel)`
  color: ${props => props.theme.colors.primary.light};
`;

export const RecursiveLabel = styled(FieldLabel)`
  color: ${({ theme }) => theme.colors.warning.main};
  font-size: 13px;
`;

export const PatternLabel = styled(FieldLabel)`
  color: ${palette.gray.dark3};
  &::before,
  &::after {
    font-weight: bold;
  }
`;

export const ExampleValue = styled(FieldLabel)`
  border-radius: 2px;
  word-break: break-word;
  ${({ theme }) => `
    background-color: ${palette.gray.light3};
    color: ${palette.gray.dark3};

    padding: 0 ${theme.spacing.unit}px;
    border: 1px solid ${palette.gray.light2};
    font-family: ${theme.typography.code.fontFamily};
}`};
  & + & {
    margin-left: 0;
  }
  ${extensionsHook('ExampleValue')};
`;

export const ExtensionValue = styled(ExampleValue)``;

export const ConstraintItem = styled(FieldLabel)`
  border-radius: 2px;
  ${({ theme }) => `
    background-color: ${palette.blue.light3};
    color: ${palette.blue.base};

    margin: 0 ${theme.spacing.unit}px;
    padding: 0 ${theme.spacing.unit}px;
    border: 1px solid ${palette.blue.light2};
}`};
  & + & {
    margin-left: 0;
  }
  ${extensionsHook('ConstraintItem')};
`;

export const ToggleButton = styled.button`
  background-color: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: ${({ theme }) => theme.spacing.unit}px;
  border-radius: 2px;
  cursor: pointer;
  outline-color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 12px;
`;
