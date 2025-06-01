import AsyncStorage from '@react-native-async-storage/async-storage';

interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  context?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  reported: boolean;
}

interface ErrorContext {
  componentStack?: string;
  userInitiated?: boolean;
  [key: string]: any;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errorQueue: ErrorLogEntry[] = [];
  private maxQueueSize = 50;
  private storageKey = '@golf_caddy_error_logs';
  private crashReporter: ((error: Error, context?: any) => void) | null = null;

  private constructor() {
    this.loadStoredErrors();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Initialize crash reporter (e.g., Sentry)
   */
  initializeCrashReporter(reporter: (error: Error, context?: any) => void) {
    this.crashReporter = reporter;
  }

  /**
   * Log an error with context
   */
  async logError(
    error: Error,
    context?: ErrorContext,
    severity: ErrorLogEntry['severity'] = 'error'
  ) {
    const entry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      error: {
        message: error.message,
        ...(error.stack && { stack: error.stack }),
        name: error.name,
      },
      ...(context && { context }),
      severity,
      reported: false,
    };

    // Add to queue
    this.errorQueue.push(entry);

    // Trim queue if needed
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Store errors
    await this.storeErrors();

    // Report critical errors immediately
    if (severity === 'critical' && this.crashReporter) {
      this.reportError(error, context);
    }

    // Log to console in development
    if (__DEV__) {
      console.error('ErrorLogger:', error, context);
    }
  }

  /**
   * Report error to crash reporting service
   */
  reportError(error: Error, context?: ErrorContext) {
    if (this.crashReporter) {
      this.crashReporter(error, context);

      // Mark as reported
      const entry = this.errorQueue.find(
        (e) => e.error.message === error.message && e.error.stack === error.stack
      );
      if (entry) {
        entry.reported = true;
      }
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorLogEntry[] {
    return [...this.errorQueue];
  }

  /**
   * Get unreported errors
   */
  getUnreportedErrors(): ErrorLogEntry[] {
    return this.errorQueue.filter((e) => !e.reported);
  }

  /**
   * Clear all errors
   */
  async clearErrors() {
    this.errorQueue = [];
    await AsyncStorage.removeItem(this.storageKey);
  }

  /**
   * Report all unreported errors
   */
  async reportAllErrors() {
    const unreported = this.getUnreportedErrors();

    for (const entry of unreported) {
      const error = new Error(entry.error.message);
      error.name = entry.error.name;
      if (entry.error.stack) {
        error.stack = entry.error.stack;
      }

      this.reportError(error, entry.context);
    }

    await this.storeErrors();
  }

  /**
   * Store errors to AsyncStorage
   */
  private async storeErrors() {
    try {
      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify(
          this.errorQueue.map((e) => ({
            ...e,
            timestamp: e.timestamp.toISOString(),
          }))
        )
      );
    } catch (e) {
      console.error('Failed to store errors:', e);
    }
  }

  /**
   * Load stored errors from AsyncStorage
   */
  private async loadStoredErrors() {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.errorQueue = parsed.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }
    } catch (e) {
      console.error('Failed to load stored errors:', e);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log info message
   */
  logInfo(message: string, context?: ErrorContext) {
    const error = new Error(message);
    error.name = 'Info';
    this.logError(error, context, 'info');
  }

  /**
   * Log warning message
   */
  logWarning(message: string, context?: ErrorContext) {
    const error = new Error(message);
    error.name = 'Warning';
    this.logError(error, context, 'warning');
  }

  /**
   * Log critical error
   */
  logCritical(error: Error, context?: ErrorContext) {
    this.logError(error, context, 'critical');
  }
}

export const errorLogger = ErrorLogger.getInstance();
