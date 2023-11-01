import styled from 'styled-components';
import { linksCss } from '../Markdown/styled.elements';
import { media } from '../../styled-components';
import { UnderlinedHeader } from '../../common-elements';

export const Header = styled.div`
  background-color: #e4e7eb;
`;

export const ScopeNameList = styled.ul`
  display: inline;
  list-style: none;
  padding: 0;

  li {
    display: inherit;

    &:after {
      content: ',';
    }
    &:last-child:after {
      content: none;
    }
  }
`;

export const ScopeName = styled.code`
  font-size: ${props => props.theme.typography.code.fontSize};
  font-family: ${props => props.theme.typography.code.fontFamily};
  margin: 0 3px;
  padding: 0.2em;
  display: inline-block;
  line-height: 1;

  &:after {
    content: ',';
    font-weight: normal;
  }

  &:last-child:after {
    content: none;
  }
`;

export const SecurityRequirementAndWrap = styled.span`
  &:after {
    content: ' and ';
    font-weight: normal;
  }

  &:last-child:after {
    content: none;
  }

  ${linksCss};
`;

export const SecurityRequirementOrWrap = styled.span<{ $expanded?: boolean }>`
  ${p => !p.$expanded && `white-space: nowrap;`}
  &:after {
    content: ' or ';
    ${p => p.$expanded && `content: ' or \\a';`}
    white-space: pre;
  }

  &:last-child:after,
  &:only-child:after {
    content: none;
  }

  ${linksCss};
`;

export const AuthHeaderColumn = styled.div`
  flex: 1 1 auto;
  cursor: pointer;
`;

export const SecuritiesColumn = styled.div<{ $expanded?: boolean }>`
  width: ${props => props.theme.schema.defaultDetailsWidth};
  text-overflow: ellipsis;
  border-radius: 4px;
  overflow: hidden;
  ${p =>
    p.$expanded &&
    `background: ${p.theme.colors.gray['100']};
     padding: 8px 9.6px;
     margin: 20px 0;
     width: 100%;
    `};
  ${media.lessThan('small')`
    margin-top: 10px;
  `}
`;

export const AuthHeader = styled(UnderlinedHeader)`
  display: inline-block;
  margin: 0;
`;

export const Wrap = styled.div<{ $expanded?: boolean }>`
  width: 100%;
  display: flex;
  margin: 1em 0;
  flex-direction: ${p => (p.$expanded ? 'column' : 'row')};
  ${media.lessThan('small')`
    flex-direction: column;
  `}
`;

export const SecurityRow = styled.div`
  margin: 0.5em 0;
`;

export const SecurityDetailsStyle = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.dark};
  margin-bottom: 1.5em;
  padding-bottom: 0.7em;

  h5 {
    line-height: 1em;
    margin: 0 0 0.6em;
    font-size: ${({ theme }) => theme.typography.fontSize};
  }

  .redoc-markdown p:first-child {
    display: inline;
  }
`;
