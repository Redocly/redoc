import { Component } from 'react';
import { styled } from 'styled-components';

import type { ReactNode, ErrorInfo, ContextType } from 'react';

import { breakpoints } from '@redocly/theme/core/openapi';
import { Accordion } from '@redocly/theme/markdoc/components/Accordion/Accordion';

import { getPageUri, sanitizeErrorDetails, TelemetryContext } from '../telemetry/index.js';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = TelemetryContext;
  declare context: ContextType<typeof TelemetryContext>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[api-docs] Rendering error:', error, errorInfo.componentStack);
    const telemetry = this.context;
    try {
      telemetry.sendErrorMessage([
        {
          id: 'errorBoundaryCatch',
          object: 'error',
          uri: getPageUri(),
          ...(telemetry.typeOfUsage ? { typeOfUsage: telemetry.typeOfUsage } : {}),
          details: sanitizeErrorDetails(error, errorInfo.componentStack),
        },
      ]);
    } catch (telemetryError) {
      console.error('[api-docs] error telemetry failed:', telemetryError);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorWrapper role="alert" className="api-docs-error-page">
          <ErrorContent>
            <Title>Something went wrong rendering the API documentation.</Title>
            <DetailsAccordion title="Error details" expanded={false}>
              <Message>{this.state.error?.message}</Message>
            </DetailsAccordion>
            <ButtonRow>
              <ReloadButton type="button" onClick={() => window.location.reload()}>
                Reload page
              </ReloadButton>
            </ButtonRow>
          </ErrorContent>
        </ErrorWrapper>
      );
    }

    return this.props.children;
  }
}

const ErrorWrapper = styled.div`
  box-sizing: border-box;
  min-height: calc(100vh - var(--navbar-height, 0px) - var(--banner-height, 0px));
  min-height: calc(100dvh - var(--navbar-height, 0px) - var(--banner-height, 0px));
  background: var(--bg-color, #ffffff);
  font-family: var(--font-family-base, system-ui, sans-serif);
  color: var(--text-color-primary, #1a1c21);
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  min-height: inherit;
  max-width: 620px;
  margin: 0 calc(var(--spacing-xxl, 48px) * 2);
  padding: var(--spacing-xl, 32px) 0;

  @media screen and (max-width: ${breakpoints.small}) {
    margin: 0 var(--spacing-lg, 24px);
  }
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text-color-primary, #1a1c21);
  font-size: 32px;
  line-height: 40px;
  font-weight: var(--font-weight-bold, 700);
`;

const DetailsAccordion = styled(Accordion)`
  margin: var(--spacing-lg, 24px) 0 0;
`;

const Message = styled.div`
  color: var(--text-color-secondary, #3b3c45);
  font-family: var(--font-family-monospaced, monospace);
  font-size: var(--font-size-lg, 16px);
  line-height: var(--line-height-lg, 24px);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const ButtonRow = styled.div`
  margin-top: var(--spacing-xl, 32px);
`;

const ReloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 5px var(--spacing-base, 16px);
  border: none;
  border-radius: var(--border-radius-lg, 8px);
  background: var(--button-bg-color-primary, #3e63dd);
  color: #ffffff;
  font-family: inherit;
  font-size: var(--font-size-base, 14px);
  line-height: var(--line-height-base, 22px);
  font-weight: var(--font-weight-semibold, 600);
  cursor: pointer;

  &:hover {
    filter: brightness(1.08);
  }
`;
