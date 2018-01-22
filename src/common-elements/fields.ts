import styled from 'styled-components';
import { transparentizeHex } from '../utils/styled';
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
  color: ${props => transparentizeHex(props.theme.colors.text, 0.4)};
`;

export const TypeName = styled(FieldLabel)`
  color: ${props => transparentizeHex(props.theme.colors.text, 0.8)};
`;
export const TypeTitle = styled(FieldLabel)`
  color: ${props => transparentizeHex(props.theme.colors.text, 0.5)};
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
  background-color: ${props => transparentizeHex(props.theme.colors.text, 0.02)};
  border: 1px solid ${props => transparentizeHex(props.theme.colors.text, 0.15)};
  margin: 0 3px;
  padding: 0.4em 0.2em 0.2em;
  font-size: 0.8em;
  border-radius: 2px;
  color: ${props => transparentizeHex(props.theme.colors.text, 0.9)};
  display: inline-block;
  min-width: 20px;
  text-align: center;
  line-height: 1;
  vertical-align: middle;
`;

export const ConstraintItem = styled(FieldLabel)`
  background-color: ${props => transparentizeHex(props.theme.colors.main, 0.15)};
  color: ${props => transparentizeHex(props.theme.colors.main, 0.6)};
  margin-right: 6px;
  margin-left: 6px;
  border-radius: 2px;
  padding: 0 4px;
`;
