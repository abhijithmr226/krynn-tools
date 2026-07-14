import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    
    // Auto-reload the page on dynamic import/chunk loading failures
    const isChunkError = 
      /Failed to fetch dynamically imported module/i.test(error.message) ||
      /Loading chunk/i.test(error.message) ||
      /CSS chunk/i.test(error.message);

    if (isChunkError) {
      console.warn("Chunk load error detected. Reloading page to fetch latest deployment...");
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <p style={{ fontSize: "3rem" }}>⚠️</p>
          <h2 style={{ fontWeight: 700, color: "var(--color-foreground)" }}>
            Something went wrong
          </h2>
          <p style={{ color: "var(--color-muted-foreground)", maxWidth: "400px", lineHeight: 1.6 }}>
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{
              padding: "10px 24px", borderRadius: "10px",
              background: "var(--color-primary)", color: "#fff",
              border: "none", cursor: "pointer", fontWeight: 600,
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
