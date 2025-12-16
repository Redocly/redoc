import { useEffect } from 'react';
import styled from 'styled-components';

import { GlobalStyle as ThemeCommonStyle } from '@redocly/theme/core/openapi';

import { redocTelemetry } from '../../services/telemetry.js';

export function ErrorPage({
  typeOfUsage,
  description,
}: {
  typeOfUsage: 'html' | 'cli' | 'react' | 'docker';
  description: string;
}) {
  useEffect(() => {
    redocTelemetry.sendEvent('redoc_ce.error', {
      typeOfUsage,
      details: { message: description },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ThemeCommonStyle />
      <Wrapper>
        <StatusText>;(</StatusText>
        <Title>Something went wrong...</Title>
        <Description>
          Please check the console to get more error details. You can troubleshoot your setup by
          visiting our{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://redocly.com/docs/redoc">
            documentation
          </a>
          .
        </Description>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  max-width: var(--page-404-max-width);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: var(--page-404-margin-vertical) var(--page-404-margin-horizontal);
  font-family: var(--page-404-font-family);
  gap: var(--page-404-gap);
`;

const StatusText = styled.div`
  color: var(--page-404-status-text-color);
  font-size: var(--page-404-status-font-size);
  line-height: var(--page-404-status-line-height);
  font-weight: var(--page-404-status-font-weight);
`;

const Title = styled.div`
  color: var(--page-404-title-text-color);
  font-size: var(--page-404-title-font-size);
  line-height: var(--page-404-title-line-height);
  font-weight: var(--page-404-title-font-weight);
`;

const Description = styled.div`
  color: var(--page-404-description-text-color);
  font-size: var(--page-404-description-font-size);
  line-height: var(--page-404-description-line-height);
  font-weight: var(--page-404-description-font-weight);
`;
