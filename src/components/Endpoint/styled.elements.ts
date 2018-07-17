import styled, { withProps } from '../../styled-components';

export const OperationEndpointWrap = styled.div`
  cursor: pointer;
  position: relative;
  margin-bottom: 5px;
`;

export const ServerRelativeURL = styled.span`
  font-family: ${props => props.theme.headingsFont.family};
  margin-left: 10px;
`;

export const EndpointInfo = withProps<{ expanded?: boolean; inverted?: boolean }>(styled.div)`
  padding: 10px 30px 10px ${props => (props.inverted ? '10px' : '20px')};
  border-radius: ${props => (props.inverted ? '0' : '4px 4px 0 0')};
  background-color: ${props => (props.inverted ? 'transparent' : '#222d32')};
  display: block;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  border: ${props => (props.inverted ? '0' : '1px solid transparent')};
  border-bottom: ${props => (props.inverted ? '1px solid #ccc' : '0')};
  transition: border-color 0.25s ease;

  ${props => (props.expanded && !props.inverted && 'border-color: #3c4448;') || ''}

  .${ServerRelativeURL} {
    color: ${props => (props.inverted ? props.theme.colors.text : '#ffffff')}
  }
`;

export const HttpVerb = withProps<{ type: string }>(styled.span).attrs({
  className: props => `http-verb ${props.type}`,
})`
  font-size: 0.929em;
  line-height: 20px;
  background-color: ${props => props.theme.colors.http[props.type] || '#999999'};
  color: #ffffff;
  padding: 3px 10px;
  text-transform: uppercase;
  font-family: ${props => props.theme.headingsFont.family};
  margin: 0;
`;

export const ServersOverlay = withProps<{ expanded: boolean }>(styled.div)`
  position: absolute;
  width: 100%;
  z-index: 100;
  background: #fafafa;
  color: #263238;
  box-sizing: border-box;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.33);
  overflow: hidden;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: all 0.25s ease;

  ${props => (props.expanded ? '' : 'transform: translateY(-50%) scaleY(0);')}
`;

export const ServerItem = styled.div`
  padding: 10px;
`;

export const ServerUrl = styled.div`
  padding: 5px;
  border: 1px solid #ccc;
  background: #fff;
  word-break: break-all;
  color: ${props => props.theme.colors.main};
  > span {
    color: ${props => props.theme.colors.text};
  }
`;
