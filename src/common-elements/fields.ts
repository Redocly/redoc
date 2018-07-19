import { transparentize } from 'polished';

import styled, { extensionsHook } from '../styled-components';
import { PropertyNameCell } from './fields-layout';
import { ShelfIcon } from './shelfs';

export const ClickablePropertyNameCell = PropertyNameCell.extend`
  cursor: pointer;

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
  font-size: 0.929em;
  line-height: 20px;
`;

export const TypePrefix = FieldLabel.extend`
  color: ${props => transparentize(0.2, props.theme.schema.typeNameColor)};
`;

export const TypeName = FieldLabel.extend`
  color: ${props => props.theme.schema.typeNameColor};
`;

export const TypeTitle = FieldLabel.extend`
  color: ${props => props.theme.schema.typeTitleColor};
`;

export const TypeFormat = TypeName;

export const RequiredLabel = FieldLabel.withComponent('div').extend`
  color: ${props => props.theme.schema.requireLabelColor};
  font-size: ${props => props.theme.schema.labelsTextSize};
  font-weight: normal;
  margin-left: 20px;
  line-height: 1;
`;

export const RecursiveLabel = FieldLabel.extend`
  color: ${({ theme }) => theme.colors.warning.main};
  font-size: 13px;
`;

export const NullableLabel = FieldLabel.extend`
  color: #3195a6;
  font-size: 13px;
`;

export const PatternLabel = FieldLabel.extend`
  color: #3195a6;
  &::before,
  &::after {
    content: '/';
    font-weight: bold;
  }
`;

export const ExampleValue = FieldLabel.extend`
  border-radius: 2px;
  ${({ theme }) => `
    background-color: ${transparentize(0.95, theme.colors.text.primary)};
    color: ${transparentize(0.1, theme.colors.text.primary)};

    margin: ${theme.spacing.unit}px;
    padding: 0 ${theme.spacing.unit}px;
    border: 1px solid ${transparentize(0.9, theme.colors.text.primary)};
}`};
  & + & {
    margin-left: 0;
  }
  ${extensionsHook('ExampleValue')};
`;

export const ConstraintItem = FieldLabel.extend`
  border-radius: 2px;
  ${({ theme }) => `
    background-color: ${transparentize(0.95, theme.colors.primary.light)};
    color: ${transparentize(0.1, theme.colors.primary.main)};

    margin: 0 ${theme.spacing.unit}px;
    padding: 0 ${theme.spacing.unit}px;
    border: 1px solid ${transparentize(0.9, theme.colors.primary.main)};
}`};
  & + & {
    margin-left: 0;
  }
  ${extensionsHook('ConstraintItem')};
`;
