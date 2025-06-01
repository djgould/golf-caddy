import { useState, useEffect, useCallback } from 'react';
import { OfflineDownloadService } from '../services/offlineDownloadService';
import type {
  OfflineRegion,
  OfflineDownloadProgress,
  OfflineStorageInfo,
  NetworkStatus,
  OfflineRegionStatus,
  DownloadQueueItem,
} from '../types/offline';
import type { CourseWithHoles } from '../types/golf';

export interface UseOfflineDownloadsReturn {
  // State
  downloadedRegions: OfflineRegion[];
  downloadQueue: DownloadQueueItem[];
  storageInfo: OfflineStorageInfo;
  networkStatus: NetworkStatus;
  isLoading: boolean;

  // Actions
  downloadCourse: (
    course: CourseWithHoles,
    onProgress?: (progress: OfflineDownloadProgress) => void
  ) => Promise<void>;
  pauseDownload: (regionId: string) => Promise<void>;
  resumeDownload: (regionId: string) => Promise<void>;
  cancelDownload: (regionId: string) => Promise<void>;
  deleteOfflineRegion: (regionId: string) => Promise<void>;
  refreshData: () => Promise<void>;

  // Progress tracking
  getDownloadProgress: (regionId: string) => OfflineDownloadProgress | undefined;
}

export const useOfflineDownloads = (): UseOfflineDownloadsReturn => {
  const [downloadedRegions, setDownloadedRegions] = useState<OfflineRegion[]>([]);
  const [downloadQueue, setDownloadQueue] = useState<DownloadQueueItem[]>([]);
  const [storageInfo, setStorageInfo] = useState<OfflineStorageInfo>({
    totalSize: 0,
    totalRegions: 0,
  });
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: false,
    isWiFi: false,
    isMetered: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progressTracking] = useState(new Map<string, OfflineDownloadProgress>());

  const offlineService = OfflineDownloadService.getInstance();

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [regions, storage, network] = await Promise.all([
        offlineService.getDownloadedRegions(),
        offlineService.getStorageInfo(),
        Promise.resolve(offlineService.getNetworkStatus()),
      ]);

      setDownloadedRegions(regions);
      setStorageInfo(storage);
      setNetworkStatus(network);
    } catch (error) {
      console.error('Failed to load offline data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [offlineService]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  // Download course
  const downloadCourse = useCallback(
    async (course: CourseWithHoles, onProgress?: (progress: OfflineDownloadProgress) => void) => {
      try {
        setIsLoading(true);
        const regionId = `course_${course.id}`;

        // Set up progress tracking
        const progressHandler = (progress: OfflineDownloadProgress) => {
          progressTracking.set(regionId, progress);
          onProgress?.(progress);
        };

        await offlineService.downloadCourse(course, {}, progressHandler);

        // Refresh data after download
        await refreshData();
      } catch (error) {
        console.error('Download failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
        // Clean up progress tracking
        const regionId = `course_${course.id}`;
        progressTracking.delete(regionId);
      }
    },
    [offlineService, refreshData, progressTracking]
  );

  // Pause download
  const pauseDownload = useCallback(
    async (regionId: string) => {
      try {
        await offlineService.cancelDownload(regionId);
        // Note: This actually cancels the download - implement pause/resume logic if needed
        await refreshData();
      } catch (error) {
        console.error('Failed to pause download:', error);
        throw error;
      }
    },
    [offlineService, refreshData]
  );

  // Resume download
  const resumeDownload = useCallback(
    async (regionId: string) => {
      try {
        // Note: Implement resume logic if needed
        console.log('Resume functionality not implemented yet');
        await refreshData();
      } catch (error) {
        console.error('Failed to resume download:', error);
        throw error;
      }
    },
    [refreshData]
  );

  // Cancel download
  const cancelDownload = useCallback(
    async (regionId: string) => {
      try {
        await offlineService.cancelDownload(regionId);
        progressTracking.delete(regionId);
        await refreshData();
      } catch (error) {
        console.error('Failed to cancel download:', error);
        throw error;
      }
    },
    [offlineService, refreshData, progressTracking]
  );

  // Delete offline region
  const deleteOfflineRegion = useCallback(
    async (regionId: string) => {
      try {
        setIsLoading(true);
        await offlineService.deleteOfflineRegion(regionId);
        await refreshData();
      } catch (error) {
        console.error('Failed to delete offline region:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [offlineService, refreshData]
  );

  // Get download progress for a specific region
  const getDownloadProgress = useCallback(
    (regionId: string): OfflineDownloadProgress | undefined => {
      return progressTracking.get(regionId);
    },
    [progressTracking]
  );

  // Monitor network status changes
  useEffect(() => {
    const updateNetworkStatus = () => {
      const status = offlineService.getNetworkStatus();
      setNetworkStatus(status);
    };

    // Update network status periodically
    const interval = setInterval(updateNetworkStatus, 5000);

    return () => clearInterval(interval);
  }, [offlineService]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // State
    downloadedRegions,
    downloadQueue,
    storageInfo,
    networkStatus,
    isLoading,

    // Actions
    downloadCourse,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    deleteOfflineRegion,
    refreshData,

    // Progress tracking
    getDownloadProgress,
  };
};

// Helper hook for network-aware downloads
export const useNetworkAwareDownloads = () => {
  const offlineDownloads = useOfflineDownloads();
  const { networkStatus } = offlineDownloads;

  const downloadCourseIfOnline = useCallback(
    async (course: CourseWithHoles, onProgress?: (progress: OfflineDownloadProgress) => void) => {
      if (!networkStatus.isConnected) {
        throw new Error('No network connection available');
      }

      if (networkStatus.isMetered) {
        // Could show a warning about using cellular data
        console.warn('Downloading over cellular connection');
      }

      return offlineDownloads.downloadCourse(course, onProgress);
    },
    [networkStatus, offlineDownloads]
  );

  return {
    ...offlineDownloads,
    downloadCourseIfOnline,
    canDownload: networkStatus.isConnected,
    isOnWiFi: networkStatus.isWiFi,
    isOnCellular: networkStatus.isMetered,
  };
};
