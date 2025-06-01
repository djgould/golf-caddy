import { useCallback, useState } from 'react';
import { globalErrorHandler, errorLogger } from '../services/error';

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void;
  fallbackAction?: () => void;
  context?: Record<string, any>;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  const resetError = useCallback(() => {
    setError(null);
    setIsError(false);
    options.fallbackAction?.();
  }, [options.fallbackAction]);

  const handleError = useCallback(
    (error: Error, customContext?: Record<string, any>) => {
      setError(error);
      setIsError(true);

      // Log the error
      errorLogger.logError(error, {
        ...options.context,
        ...customContext,
        component: 'useErrorHandler',
      });

      // Report through global handler
      globalErrorHandler.reportError(error, {
        ...options.context,
        ...customContext,
      });

      // Call custom error handler
      options.onError?.(error);
    },
    [options.context, options.onError]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      customContext?: Record<string, any>
    ): Promise<T | null> => {
      try {
        const result = await asyncFn();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        handleError(error, customContext);
        return null;
      }
    },
    [handleError]
  );

  return {
    error,
    isError,
    resetError,
    handleError,
    handleAsyncError,
  };
}

// Hook for wrapping async operations with loading and error states
export function useAsyncOperation<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const { error, isError, resetError, handleError } = useErrorHandler();

  const execute = useCallback(
    async (
      asyncFn: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
        context?: Record<string, any>;
      }
    ) => {
      setIsLoading(true);
      resetError();

      try {
        const result = await asyncFn();
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        handleError(error, options?.context);
        options?.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, resetError]
  );

  const reset = useCallback(() => {
    setData(null);
    resetError();
    setIsLoading(false);
  }, [resetError]);

  return {
    isLoading,
    data,
    error,
    isError,
    execute,
    reset,
  };
}
