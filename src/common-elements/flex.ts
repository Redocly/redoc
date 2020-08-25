import styled from '../styled-components';

type FlexProps = {
  justifyContent?: string;
};

export const Flex = styled.div.attrs((props: FlexProps) => ({
  justifyContent: props.justifyContent,
}))<FlexProps>`
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
