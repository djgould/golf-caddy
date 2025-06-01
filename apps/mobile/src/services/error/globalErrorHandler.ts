import { errorLogger } from './errorLogger';
import { offlineErrorHandler } from './offlineErrorHandler';

interface ErrorHandler {
  (error: Error, isFatal?: boolean): void;
}

// Declare global types for React Native
declare const global: {
  ErrorUtils?: {
    setGlobalHandler: (handler: ErrorHandler) => void;
    getGlobalHandler?: () => ErrorHandler;
  };
  HermesInternal?: any;
};

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private originalHandler: ErrorHandler | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  /**
   * Initialize global error handling
   */
  initialize() {
    if (this.isInitialized) return;

    // Only set up error handling if ErrorUtils is available
    if (global.ErrorUtils && global.ErrorUtils.setGlobalHandler) {
      // Store original handler
      this.originalHandler = global.ErrorUtils.getGlobalHandler
        ? global.ErrorUtils.getGlobalHandler()
        : null;

      // Set up custom global handler
      global.ErrorUtils.setGlobalHandler(this.handleGlobalError);
    }

    // Set up unhandled promise rejection handling
    this.setupPromiseRejectionHandling();

    this.isInitialized = true;
  }

  /**
   * Handle global errors
   */
  private handleGlobalError = (error: Error, isFatal?: boolean) => {
    // Log the error
    const severity = isFatal ? 'critical' : 'error';
    errorLogger.logError(
      error,
      {
        isFatal,
        source: 'globalErrorHandler',
      },
      severity as any
    );

    // Handle offline errors
    offlineErrorHandler.handleError(error, {
      isFatal,
      source: 'globalErrorHandler',
    });

    // Call original handler if it exists (for dev tools)
    if (this.originalHandler && __DEV__) {
      this.originalHandler(error, isFatal);
    }

    // Don't crash the app unless it's fatal
    if (!isFatal && !__DEV__) {
      console.error('Non-fatal error caught:', error);
    }
  };

  /**
   * Set up promise rejection handling
   */
  private setupPromiseRejectionHandling() {
    // React Native handles promise rejections through its own mechanism
    // We'll use console.error to capture them in development
    if (__DEV__) {
      // Override console.error to capture unhandled promise rejections
      const originalConsoleError = console.error;
      console.error = (...args: any[]) => {
        // Check if this is an unhandled promise rejection
        if (
          args[0] &&
          typeof args[0] === 'string' &&
          args[0].includes('Unhandled promise rejection')
        ) {
          const error = new Error(args[1] || 'Unhandled Promise Rejection');
          error.name = 'UnhandledPromiseRejection';

          errorLogger.logError(error, {
            args,
            source: 'unhandledPromiseRejection',
          });

          offlineErrorHandler.handleError(error, {
            args,
            source: 'unhandledPromiseRejection',
          });
        }

        // Call original console.error
        originalConsoleError.apply(console, args);
      };
    }
  }

  /**
   * Manually report an error
   */
  reportError(error: Error, context?: any) {
    errorLogger.logError(error, {
      ...context,
      source: 'manual',
    });

    offlineErrorHandler.handleError(error, {
      ...context,
      source: 'manual',
    });
  }

  /**
   * Check if handler is initialized
   */
  isHandlerInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Clean up (for testing)
   */
  destroy() {
    if (this.originalHandler && global.ErrorUtils && global.ErrorUtils.setGlobalHandler) {
      global.ErrorUtils.setGlobalHandler(this.originalHandler);
    }
    this.isInitialized = false;
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
