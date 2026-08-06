import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep log for debugging unexpected runtime errors in production.
    console.error('Unexpected runtime error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <h1 className="text-xl font-semibold text-slate-800">Terjadi kendala pada aplikasi</h1>
            <p className="mt-2 text-sm text-slate-600">
              Silakan muat ulang halaman. Jika masih terjadi, bersihkan data browser lalu login
              kembali.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700"
              type="button"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
