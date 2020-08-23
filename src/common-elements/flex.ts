import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  width: 100%;
`;

export const HFlex = styled(Flex)`
  flex-direction: row;
`;

export const VFlex = styled(Flex)`
  flex-direction: column;
`;
