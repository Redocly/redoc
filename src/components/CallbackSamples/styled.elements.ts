import styled from '../../styled-components';

export const SamplesWrapper = styled.div`
  background: ${({ theme }) => theme.codeSample.backgroundColor};
  padding: ${props => props.theme.spacing.unit * 4}px;
`;

export const ReqSamplesWrapper = styled.div`
  margin-top: 15px;
`;
