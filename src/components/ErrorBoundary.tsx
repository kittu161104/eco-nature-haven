
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Alert variant="destructive" className="mb-4 max-w-md">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {this.state.error?.message && (
                <div className="text-xs mt-1 text-red-800 dark:text-red-300 opacity-80 overflow-hidden text-ellipsis">
                  Error: {this.state.error.message}
                </div>
              )}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
