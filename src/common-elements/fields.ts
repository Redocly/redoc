import { transparentize } from 'polished';
import styled from 'styled-components';
import { PropertyNameCell } from './fields-layout';

export const ClickablePropertyNameCell = PropertyNameCell.extend`
  cursor: pointer;
`;

export const FieldLabel = styled.span`
  vertical-align: middle;
  font-size: 0.929em;
  line-height: 20px;
`;

export const TypePrefix = styled(FieldLabel)`
  color: ${props => transparentize(0.4, props.theme.colors.text)};
`;

export const TypeName = styled(FieldLabel)`
  color: ${props => transparentize(0.8, props.theme.colors.text)};
`;
export const TypeTitle = styled(FieldLabel)`
  color: ${props => transparentize(0.5, props.theme.colors.text)};
`;

export const TypeFormat = TypeName;

export const RequiredLabel = styled(FieldLabel.withComponent('div'))`
  color: #e53935;
  font-size: 11px;
  font-weight: normal;
  margin-left: 20px;
  line-height: 1;
  font-weight: normal;
`;

export const RecursiveLabel = styled(FieldLabel)`
  color: #dd9900;
  font-size: 13px;
`;

export const NullableLabel = styled(FieldLabel)`
  color: #3195a6;
  font-size: 13px;
`;

export const PatternLabel = styled(FieldLabel)`
  color: #3195a6;
  &::before,
  &::after {
    content: '/';
    font-weight: bold;
  }
`;

export const ExampleValue = styled.span`
  font-family: ${props => props.theme.code.fontFamily};
  background-color: ${props => transparentize(0.98, props.theme.colors.text)};
  border: 1px solid ${props => transparentize(0.85, props.theme.colors.text)};
  margin: 0 3px;
  padding: 0.4em 0.2em 0.2em;
  font-size: 0.8em;
  border-radius: 2px;
  color: ${props => transparentize(0.1, props.theme.colors.text)};
  display: inline-block;
  min-width: 20px;
  text-align: center;
  line-height: 1;
  vertical-align: middle;
`;

export const ConstraintItem = styled(FieldLabel)`
  background-color: ${props => transparentize(0.85, props.theme.colors.main)};
  color: ${props => transparentize(0.4, props.theme.colors.main)};
  margin-right: 6px;
  margin-left: 6px;
  border-radius: 2px;
  padding: 0 4px;
`;
