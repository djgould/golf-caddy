import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { errorLogger } from '../../../src/services/error/errorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Create context object with proper typing
    const context: Record<string, any> = {};
    if (errorInfo.componentStack) {
      context.componentStack = errorInfo.componentStack;
    }
    if (errorInfo.digest) {
      context.digest = errorInfo.digest;
    }

    // Log error to our error service
    errorLogger.logError(error, context);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // If error happens too many times, suggest app restart
    if (this.state.errorCount > 3) {
      Alert.alert(
        'Multiple Errors Detected',
        'The app is experiencing issues. Would you like to restart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Restart', onPress: this.handleRestart },
        ]
      );
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRestart = async () => {
    try {
      if (!__DEV__) {
        await Updates.reloadAsync();
      } else {
        // For development, just reset the boundary
        this.handleReset();
      }
    } catch (e) {
      Alert.alert('Restart Failed', 'Please close and reopen the app manually.');
    }
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    if (error) {
      const context: Record<string, any> = { userInitiated: true };
      if (errorInfo?.componentStack) {
        context.componentStack = errorInfo.componentStack;
      }

      errorLogger.reportError(error, context);
      Alert.alert('Error Reported', 'Thank you for reporting this issue.');
    }
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default error UI
      return (
        <View className="flex-1 bg-white">
          <View className="flex-1 items-center justify-center p-6">
            <View className="bg-red-100 rounded-full p-4 mb-4">
              <Ionicons name="alert-circle" size={48} color="#dc2626" />
            </View>

            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </Text>

            <Text className="text-gray-600 text-center mb-6">
              We apologize for the inconvenience. The app encountered an unexpected error.
            </Text>

            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                onPress={this.handleReset}
                className="bg-green-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleRestart}
                className="bg-blue-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">Restart App</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={this.handleReportError} className="mb-4">
              <Text className="text-blue-600 underline">Report this error</Text>
            </TouchableOpacity>

            {__DEV__ && (
              <ScrollView className="max-h-48 bg-gray-100 p-4 rounded-lg">
                <Text className="text-xs font-mono text-gray-700">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text className="text-xs font-mono text-gray-600 mt-2">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
