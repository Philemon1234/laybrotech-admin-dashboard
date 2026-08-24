import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin dashboard crashed:', error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-brand-muted px-4 py-10 text-brand-charcoal">
        <section className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-red-700">Dashboard error</p>
          <h1 className="mt-3 text-2xl font-extrabold">The admin dashboard could not load.</h1>
          <p className="mt-3 text-sm leading-6 text-brand-softText">
            Check the browser console for the full stack trace. The most common cause is missing or invalid Supabase environment configuration.
          </p>
          <pre className="mt-5 overflow-auto rounded-xl bg-brand-muted p-4 text-xs font-semibold text-red-700">
            {this.state.error.message}
          </pre>
        </section>
      </main>
    );
  }
}
