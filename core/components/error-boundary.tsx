"use client"

/**
 * Section Error Boundary
 * Prevents section failures from crashing the entire landing page
 * Provides graceful degradation and error reporting
 */

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
  sectionId?: string
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Report error to monitoring service
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.error(`Section Error [${this.props.sectionId}]:`, error)
      console.error('Error Info:', errorInfo)
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center bg-red-50/10 border border-red-200/20 rounded-lg">
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Section Unavailable</h3>
        <p className="text-white/60 mb-4 max-w-md">
          This section encountered an error and couldn't load properly.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-red-900/20 p-3 rounded text-sm text-red-200 mb-4">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-32">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  )
}

/**
 * Higher-order component for wrapping sections with error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  sectionId: string
) {
  const WrappedComponent = (props: P) => (
    <SectionErrorBoundary sectionId={sectionId}>
      <Component {...props} />
    </SectionErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}