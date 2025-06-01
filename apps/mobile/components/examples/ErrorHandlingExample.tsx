import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAsyncOperation, useErrorHandler } from '../../src/hooks/useErrorHandler';
import { LoadingSpinner } from '../ui/animations';
import { LoadingErrorFallback } from '../ui/error';

// Example API function that might fail
const fetchGolfCourseData = async (): Promise<{ name: string; holes: number }> => {
  // Simulate API call
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));

  // Simulate random failure
  if (Math.random() > 0.5) {
    throw new Error('Failed to load golf course data');
  }

  return { name: 'Pebble Beach', holes: 18 };
};

export const ErrorHandlingExample: React.FC = () => {
  // Example 1: Using useAsyncOperation for a complete async flow
  const { isLoading, data, error, isError, execute, reset } = useAsyncOperation<{
    name: string;
    holes: number;
  }>();

  const loadCourseData = () => {
    execute(fetchGolfCourseData, {
      onSuccess: (data: { name: string; holes: number }) => {
        console.log('Course loaded:', data);
      },
      onError: (error: Error) => {
        console.log('Failed to load course:', error);
      },
      context: {
        screen: 'ErrorHandlingExample',
        action: 'loadCourseData',
      },
    });
  };

  // Example 2: Using useErrorHandler for manual error handling
  const { handleError: manualHandleError } = useErrorHandler({
    onError: (error: Error) => {
      console.log('Manual error handled:', error);
    },
    context: {
      component: 'ErrorHandlingExample',
    },
  });

  const triggerManualError = () => {
    try {
      // Simulate an error
      throw new Error('This is a manually triggered error');
    } catch (err) {
      manualHandleError(err as Error, { action: 'manual_trigger' });
    }
  };

  // Show error state with fallback UI
  if (isError) {
    return <LoadingErrorFallback onRetry={reset} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingSpinner size={60} />
        <Text className="mt-4 text-gray-600">Loading golf course...</Text>
      </View>
    );
  }

  // Show data or initial state
  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-bold mb-6">Error Handling Examples</Text>

      {data ? (
        <View className="bg-green-100 p-4 rounded-lg mb-6">
          <Text className="text-lg font-semibold">Course Loaded Successfully!</Text>
          <Text className="text-gray-700 mt-2">Name: {data.name}</Text>
          <Text className="text-gray-700">Holes: {data.holes}</Text>
        </View>
      ) : (
        <Text className="text-gray-600 mb-6">No course data loaded yet</Text>
      )}

      <View className="gap-4">
        <TouchableOpacity onPress={loadCourseData} className="bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold text-center">
            Load Golf Course (50% fail chance)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={triggerManualError} className="bg-red-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold text-center">Trigger Manual Error</Text>
        </TouchableOpacity>

        {data && (
          <TouchableOpacity onPress={reset} className="bg-gray-500 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold text-center">Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="mt-8 p-4 bg-gray-100 rounded-lg">
        <Text className="font-semibold mb-2">How to use:</Text>
        <Text className="text-sm text-gray-700">
          1. useAsyncOperation: Handles loading, error, and data states{'\n'}
          2. useErrorHandler: For manual error handling{'\n'}
          3. ErrorBoundary: Catches component tree errors{'\n'}
          4. Error fallbacks: Provide user-friendly error UIs
        </Text>
      </View>
    </View>
  );
};
