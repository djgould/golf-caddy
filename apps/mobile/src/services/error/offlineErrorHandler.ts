import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorLogger } from './errorLogger';

interface QueuedError {
  error: Error;
  context?: any;
  timestamp: Date;
  retryCount: number;
}

class OfflineErrorHandler {
  private static instance: OfflineErrorHandler;
  private errorQueue: QueuedError[] = [];
  private isOnline: boolean = true;
  private maxRetries: number = 3;
  private storageKey = '@golf_caddy_offline_errors';
  private unsubscribe: (() => void) | null = null;

  private constructor() {
    this.initializeNetworkListener();
    this.loadQueuedErrors();
  }

  static getInstance(): OfflineErrorHandler {
    if (!OfflineErrorHandler.instance) {
      OfflineErrorHandler.instance = new OfflineErrorHandler();
    }
    return OfflineErrorHandler.instance;
  }

  /**
   * Initialize network state listener
   */
  private initializeNetworkListener() {
    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      // If we just came online, process queued errors
      if (wasOffline && this.isOnline) {
        this.processQueuedErrors();
      }
    });

    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      this.isOnline = state.isConnected ?? false;
    });
  }

  /**
   * Handle an error (queue if offline, report if online)
   */
  async handleError(error: Error, context?: any) {
    if (this.isOnline) {
      // If online, report immediately
      errorLogger.reportError(error, context);
    } else {
      // If offline, queue the error
      await this.queueError(error, context);
    }
  }

  /**
   * Queue an error for later processing
   */
  private async queueError(error: Error, context?: any) {
    const queuedError: QueuedError = {
      error: {
        name: error.name,
        message: error.message,
        ...(error.stack && { stack: error.stack }),
      } as Error,
      context,
      timestamp: new Date(),
      retryCount: 0,
    };

    this.errorQueue.push(queuedError);
    await this.saveQueuedErrors();

    // Log locally
    errorLogger.logError(error, {
      ...context,
      offline: true,
      queued: true,
    });
  }

  /**
   * Process all queued errors
   */
  private async processQueuedErrors() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    for (const queuedError of errors) {
      try {
        // Recreate error object
        const error = new Error(queuedError.error.message);
        error.name = queuedError.error.name;
        if (queuedError.error.stack) {
          error.stack = queuedError.error.stack;
        }

        // Report the error
        errorLogger.reportError(error, {
          ...queuedError.context,
          queuedAt: queuedError.timestamp,
          reportedAt: new Date(),
          retryCount: queuedError.retryCount,
        });
      } catch (e) {
        // If reporting fails, re-queue if under retry limit
        if (queuedError.retryCount < this.maxRetries) {
          queuedError.retryCount++;
          this.errorQueue.push(queuedError);
        } else {
          // Log failure after max retries
          console.error('Failed to report queued error after max retries:', e);
        }
      }
    }

    // Save any errors that failed to report
    if (this.errorQueue.length > 0) {
      await this.saveQueuedErrors();
    } else {
      // Clear storage if all errors were reported
      await AsyncStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Save queued errors to storage
   */
  private async saveQueuedErrors() {
    try {
      const data = JSON.stringify(
        this.errorQueue.map((e) => ({
          error: {
            name: e.error.name,
            message: e.error.message,
            stack: e.error.stack,
          },
          context: e.context,
          timestamp: e.timestamp.toISOString(),
          retryCount: e.retryCount,
        }))
      );
      await AsyncStorage.setItem(this.storageKey, data);
    } catch (e) {
      console.error('Failed to save queued errors:', e);
    }
  }

  /**
   * Load queued errors from storage
   */
  private async loadQueuedErrors() {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.errorQueue = parsed.map((e: any) => ({
          error: e.error,
          context: e.context,
          timestamp: new Date(e.timestamp),
          retryCount: e.retryCount,
        }));

        // Process if online
        if (this.isOnline) {
          this.processQueuedErrors();
        }
      }
    } catch (e) {
      console.error('Failed to load queued errors:', e);
    }
  }

  /**
   * Get current network status
   */
  getNetworkStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Get queued error count
   */
  getQueuedErrorCount(): number {
    return this.errorQueue.length;
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export const offlineErrorHandler = OfflineErrorHandler.getInstance();
