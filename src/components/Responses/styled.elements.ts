import { UnderlinedHeader } from '../../common-elements';
import styled from '../../styled-components';
import { ResponseTitle } from './ResponseTitle';

export const StyledResponseTitle = styled(ResponseTitle)`
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  white-space: normal;
  width: 100%;
  text-align: left;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  line-height: 1.5em;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.responses[props.type].color};

  background-color: ${props => props.theme.colors.responses[props.type].backgroundColor};
  &:focus {
    outline: auto ${props => props.theme.colors.responses[props.type].color};
  }
  ${props =>
    (props.empty &&
      `
cursor: default;
&::before {
  content: "—";
  font-weight: bold;
  width: 1.5em;
  text-align: center;
  display: inline-block;
  vertical-align: top;
}
&:focus {
  outline: 0;
}
`) ||
    ''};
`;

export const ResponseDetailsWrap = styled.div`
  padding: 5px 10px 25px;
`;

export const HeadersCaption = styled(UnderlinedHeader).attrs({
  as: 'caption',
})`
  text-align: left;
  margin-top: 1em;
  caption-side: top;
`;

export const Code = styled.strong`
  vertical-align: top;
`;
export const ResponseTitleWrap = styled.div`
  display: flex;
  gap: 5px;
  align-items: baseline;
`;
