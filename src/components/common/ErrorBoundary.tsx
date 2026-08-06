import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, Bug } from 'lucide-react';
import { logger, getErrorReportLink, captureErrorContext } from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallbackUI?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('[ErrorBoundary]', error.message, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackUI) {
        return this.props.fallbackUI;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Terjadi kendala pada aplikasi
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Silakan coba lagi. Jika masalah berlanjut, hubungi administrator.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">
                  Detail Error (Developer Mode)
                </summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-50 p-3 text-xs text-red-600">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Coba Lagi
              </button>
              {this.state.error && (
                <a
                  href={getErrorReportLink(
                    captureErrorContext(this.state.error, {
                      page: window.location.pathname,
                    })
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Bug size={16} />
                  Laporkan Bug
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
