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
  background: none;
  border: none;
  line-height: 1.5em;
  cursor: pointer;
  ${props =>
    (props.empty &&
      `
cursor: default;
&::after {
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
  padding: 20px;
  background-color: rgb(255, 255, 255);
  border-radius: 0 0 4px 4px;
  overflow-x: auto;
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

export const ResponseWrap = styled.div<{ $type: string }>`
  border: 1px solid ${props => props.theme.colors.responses[props.$type].color};
  background-color: ${props => props.theme.colors.responses[props.$type].backgroundColor};
  border-radius: 4px;
  margin-bottom: 10px;
`;
