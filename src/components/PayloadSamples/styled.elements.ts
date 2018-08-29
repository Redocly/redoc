import styled from '../../styled-components';

import { StyledDropdown } from '../../common-elements';

export const MimeLabel = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  margin: 0 0 10px 0;
  display: block;
  color: rgba(255, 255, 255, 0.8);
`;

export const InvertedSimpleDropdown = styled(StyledDropdown)`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.929em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  margin: 0 0 10px 0;
  display: block;

  .Dropdown-control,
  .Dropdown-control:hover {
    font-size: 1em;
    border: none;
    padding: 0 1.2em 0 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.9);
    box-shadow: none;

    .Dropdown-arrow {
      border-top-color: rgba(255, 255, 255, 0.9);
    }
  }
  .Dropdown-menu {
    margin: 0;
  }
`;

export const NoSampleLabel = styled.div`
  font-family: ${props => props.theme.typography.code.fontFamily};
  font-size: 12px;
  color: #ee807f;
`;
