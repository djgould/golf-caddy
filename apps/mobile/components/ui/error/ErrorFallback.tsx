import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  showDetails?: boolean;
  showRetryButton?: boolean;
  retryButtonText?: string;
  customAction?: {
    label: string;
    onPress: () => void;
  };
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  icon = 'alert-circle',
  iconColor = '#dc2626',
  showDetails = false,
  showRetryButton = true,
  retryButtonText = 'Try Again',
  customAction,
}) => {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center p-6">
        <View className="bg-red-100 rounded-full p-4 mb-4">
          <Ionicons name={icon} size={48} color={iconColor} />
        </View>

        <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">{title}</Text>

        <Text className="text-gray-600 text-center mb-6 px-4">{message}</Text>

        <View className="flex-row gap-3">
          {showRetryButton && resetError && (
            <TouchableOpacity onPress={resetError} className="bg-green-500 px-6 py-3 rounded-lg">
              <Text className="text-white font-semibold">{retryButtonText}</Text>
            </TouchableOpacity>
          )}

          {customAction && (
            <TouchableOpacity
              onPress={customAction.onPress}
              className="bg-blue-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">{customAction.label}</Text>
            </TouchableOpacity>
          )}
        </View>

        {showDetails && error && __DEV__ && (
          <View className="mt-6 bg-gray-100 p-4 rounded-lg max-w-full">
            <Text className="text-xs font-mono text-gray-700">
              {error.name}: {error.message}
            </Text>
            {error.stack && (
              <Text className="text-xs font-mono text-gray-600 mt-2" numberOfLines={10}>
                {error.stack}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// Specific error fallback components
export const NetworkErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorFallback
    title="No Internet Connection"
    message="Please check your network settings and try again."
    icon="wifi-outline"
    iconColor="#6b7280"
    retryButtonText="Retry"
    {...(onRetry && { resetError: onRetry })}
  />
);

export const LoadingErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorFallback
    title="Failed to Load"
    message="We couldn't load the content. Please try again."
    icon="refresh-outline"
    iconColor="#3b82f6"
    retryButtonText="Reload"
    {...(onRetry && { resetError: onRetry })}
  />
);

export const PermissionErrorFallback: React.FC<{
  permission: string;
  onRequestPermission?: () => void;
}> = ({ permission, onRequestPermission }) => (
  <ErrorFallback
    title="Permission Required"
    message={`This feature requires ${permission} permission to work properly.`}
    icon="lock-closed-outline"
    iconColor="#f59e0b"
    showRetryButton={false}
    {...(onRequestPermission && {
      customAction: { label: 'Grant Permission', onPress: onRequestPermission },
    })}
  />
);
