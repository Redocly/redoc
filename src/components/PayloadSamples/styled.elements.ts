import styled from '../../styled-components';

import { SimpleDropdown } from '../../common-elements';

export const MimeLabel = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  margin: 0 0 10px 0;
  display: block;
  color: rgba(255, 255, 255, 0.8);
`;

export const InvertedSimpleDropdown = styled(SimpleDropdown)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  margin: 0 0 10px 0;
  display: block;

  .Dropdown-control,
  .Dropdown-control:hover {
    color: rgba(255, 255, 255, 0.9);

    .Dropdown-arrow {
      border-top-color: rgba(255, 255, 255, 0.9);
    }
  }
  .Dropdown-menu {
    margin: 0;
  }
`;

export const NoSampleLabel = styled.div`
  font-family: ${props => props.theme.code.fontFamily};
  font-size: 12px;
  color: #ee807f;
`;
