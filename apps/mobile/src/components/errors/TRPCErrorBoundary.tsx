/**
 * Golf Caddy tRPC Error Boundary
 *
 * This component provides comprehensive error handling for tRPC and API errors
 * throughout the mobile application with user-friendly error messages.
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { getTRPCErrorMessage, isTRPCError } from '../../config/trpc';

interface TRPCErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface TRPCErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: React.ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class TRPCErrorBoundary extends Component<TRPCErrorBoundaryProps, TRPCErrorBoundaryState> {
  constructor(props: TRPCErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): TRPCErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error details in development
    if (__DEV__) {
      console.error('🚨 Golf Caddy Error Boundary caught an error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        isTRPCError: isTRPCError(error),
      });
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo!, this.retry);
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  retry: () => void;
}

function DefaultErrorFallback({ error, errorInfo, retry }: DefaultErrorFallbackProps) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isTRPCErr = isTRPCError(error);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 24,
          width: '100%',
          maxWidth: 400,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Error Icon */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 8 }}>
            {isNetworkError ? '📡' : isTRPCErr ? '⚠️' : '❌'}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#dc2626',
              textAlign: 'center',
            }}
          >
            {isNetworkError ? 'Connection Problem' : 'Something went wrong'}
          </Text>
        </View>

        {/* Error Message */}
        <Text
          style={{
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 24,
          }}
        >
          {isNetworkError
            ? 'Please check your internet connection and try again.'
            : getTRPCErrorMessage(error)}
        </Text>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={retry}
            style={{
              backgroundColor: '#059669',
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 24,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>

          {__DEV__ && (
            <TouchableOpacity
              onPress={() => {
                console.log('Error Details:', {
                  error: error.message,
                  stack: error.stack,
                  componentStack: errorInfo?.componentStack,
                });
              }}
              style={{
                backgroundColor: '#6b7280',
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                }}
              >
                Log Details (Dev)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Development Error Details */}
        {__DEV__ && (
          <ScrollView
            style={{
              marginTop: 20,
              maxHeight: 200,
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'monospace',
                color: '#374151',
              }}
            >
              {error.stack}
            </Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

/**
 * Hook for handling tRPC query errors in components
 */
export function useTRPCErrorHandler() {
  return {
    handleError: (error: unknown) => {
      if (isTRPCError(error)) {
        console.warn('tRPC Error:', getTRPCErrorMessage(error));
      } else {
        console.error('Unexpected error:', error);
      }
    },
    getErrorMessage: getTRPCErrorMessage,
    isTRPCError,
  };
}

export default TRPCErrorBoundary;
