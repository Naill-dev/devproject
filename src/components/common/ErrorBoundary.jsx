import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Bir xəta baş verdi</h2>
            <p className="text-slate-600 mb-4">{this.state.error?.message || 'Bilinməyən xəta'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Səhifəni yenilə
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
