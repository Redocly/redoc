import { Component } from 'react';

import type { ErrorInfo, ReactNode } from 'react';

import { ErrorPage } from './Error.js';
import { redocTelemetry } from '../../services/telemetry.js';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  Props & { typeOfUsage?: 'html' | 'cli' | 'react' | 'docker' },
  State
> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const typeOfUsage = this.props.typeOfUsage || 'html';
    redocTelemetry.sendEvent('redoc_ce.error', {
      typeOfUsage,
      details: { message: error.message, stack: errorInfo.componentStack ?? undefined },
    });
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          typeOfUsage={this.props.typeOfUsage || 'html'}
          description={this.state.error?.message || 'Something went wrong'}
        />
      );
    }

    return this.props.children;
  }
}
