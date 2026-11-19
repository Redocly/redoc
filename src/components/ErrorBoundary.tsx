import { Component } from 'react';
import { styled } from 'styled-components';

import type { ReactElement, ReactNode, ErrorInfo, ContextType } from 'react';
import type { RedocTelemetryConfig } from '../telemetry/RedocTelemetry.js';

import { breakpoints } from '@redocly/theme/core/openapi';
import { Accordion } from '@redocly/theme/markdoc/components/Accordion/Accordion';

import { sendErrorTelemetry, TelemetryContext } from '../telemetry/index.js';
import { RedocTelemetry } from '../telemetry/RedocTelemetry.js';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** `page` (default) and `root` show the error page in place of their children; any other scope renders nothing. */
  scope?: 'root' | 'page' | 'section' | 'node' | 'sidebar';
  /** Reports through its own telemetry instance instead of the context: for a boundary that sits above the telemetry provider. */
  telemetryConfig?: Partial<RedocTelemetryConfig>;
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
    const { telemetryConfig, scope } = this.props;
    const telemetry = telemetryConfig ? new RedocTelemetry(telemetryConfig) : this.context;
    sendErrorTelemetry(telemetry, errorEventId(scope), error, errorInfo.componentStack);
    if (telemetryConfig) void telemetry.forceFlush();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      if (this.props.scope && this.props.scope !== 'page' && this.props.scope !== 'root') {
        return null;
      }
      return <ErrorPage message={this.state.error?.message} />;
    }

    return this.props.children;
  }
}

function ErrorPage({ message }: { message?: string }): ReactElement {
  return (
    <ErrorWrapper role="alert" className="api-docs-error-page">
      <ErrorContent>
        <Title>Something went wrong rendering the API documentation.</Title>
        <DetailsAccordion title="Error details" expanded={false}>
          <Message>{message}</Message>
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

function errorEventId(scope: ErrorBoundaryProps['scope']): string {
  return !scope || scope === 'page' ? 'errorBoundaryCatch' : `errorBoundaryCatch.${scope}`;
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

  summary svg {
    width: var(--md-accordion-chevron-icon-size, 16px);
    height: var(--md-accordion-chevron-icon-size, 16px);
  }

  summary svg path {
    fill: var(--md-accordion-chevron-icon-color, currentColor);
  }
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
