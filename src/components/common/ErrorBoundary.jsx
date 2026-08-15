import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-rose-400 mb-3">
              Oops! Bir xəta baş verdi
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              {this.state.error?.message || 'Bilinməyən xəta. Tətbiq çökmədi — Error Boundary tutdu.'}
            </p>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium"
              onClick={() => window.location.assign('/')}
            >
              Ana səhifəyə qayıt
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
