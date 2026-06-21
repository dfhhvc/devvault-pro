"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * React Error Boundary for tool components.
 * Catches rendering errors to prevent full-page white screen.
 * Users can reset the error to return to the tool list.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Tool error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center max-w-md">
            <h2 className="text-base font-semibold mb-2">
              {"\u5de5\u5177\u8fd0\u884c\u51fa\u9519"}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error?.message || "\u672a\u77e5\u9519\u8bef"}
            </p>
            <Button onClick={this.handleReset} variant="outline">
              {"\u91cd\u8bd5"}
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
