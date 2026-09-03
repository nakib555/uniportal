import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, LogOut } from 'lucide-react';
import { useAppStore } from '../store';
import { tempAuthService } from '../services/tempAuthService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as unknown as {
  new (props: Props): {
    props: Props;
    state: State;
    setState(state: Partial<State>): void;
  };
}) {
  public state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleFullReset = () => {
    try {
      tempAuthService.clearTempCredentials();
      useAppStore.getState().setIsLoggedIn(false);
      localStorage.removeItem('pu_active_student_id');
      localStorage.removeItem('pu_session_expires_at');
      localStorage.setItem('pu_is_logged_in', 'false');
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          id="error-boundary-screen"
          className="min-h-screen w-full flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-4 text-stone-900 dark:text-stone-100 font-sans"
        >
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight">Something unexpected happened</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                The application encountered an unexpected state. You can try recovering or returning to the portal login.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-left text-xs font-mono text-stone-600 dark:text-stone-400 overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                id="error-boundary-retry-btn"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-sm font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                type="button"
                id="error-boundary-login-btn"
                onClick={this.handleFullReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8c1515] hover:bg-[#701111] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Return to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
