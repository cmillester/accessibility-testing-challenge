import React from "react";

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  onReturnHome: () => void;
}

interface RouteErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render/runtime errors in the current screen so a bug in one
 * route (a bad data shape, a missing id, a stale localStorage value from
 * an older version of the app) shows a clear, actionable recovery screen
 * instead of unmounting the entire app to a blank page.
 */
export class RouteErrorBoundary extends React.Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Route error caught by RouteErrorBoundary:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
    this.props.onReturnHome();
  };

  handleClearLocalData = () => {
    try {
      window.localStorage.clear();
    } catch {
      // ignore — nothing more we can do if storage is blocked
    }
    this.setState({ error: null });
    this.props.onReturnHome();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="container" style={{ paddingBlock: "var(--space-7)" }}>
          <div className="card stack-sm" role="alert" style={{ borderColor: "var(--color-danger)" }}>
            <h1 style={{ margin: 0, fontSize: "1.3rem" }}>Something didn't load correctly</h1>
            <p style={{ margin: 0 }}>
              This screen ran into a problem and couldn't display. Your
              progress is still safe. You can return home and try again.
            </p>
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={this.handleReset}>
                Return home
              </button>
              <button type="button" className="btn btn-secondary" onClick={this.handleClearLocalData}>
                Reset local data and return home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
