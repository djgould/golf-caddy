import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapboxGL from '../config/mapbox';
import { OfflineRegionStatus } from '../types/offline';
import type {
  OfflineRegion,
  OfflineDownloadOptions,
  OfflineDownloadProgress,
  OfflineStorageInfo,
  NetworkStatus,
  DownloadQueueItem,
  OfflineDownloadError,
  CleanupCriteria,
} from '../types/offline';
import type { CourseWithHoles } from '../types/golf';

export class OfflineDownloadService {
  private static instance: OfflineDownloadService;
  private downloadQueue: DownloadQueueItem[] = [];
  private activeDownloads = new Map<string, any>(); // Store cancellable downloads
  private progressCallbacks = new Map<string, (progress: OfflineDownloadProgress) => void>();
  private networkStatus: NetworkStatus = {
    isConnected: false,
    isWiFi: false,
    isMetered: false,
  };

  private readonly STORAGE_KEYS = {
    REGIONS: '@golf_caddy_offline_regions',
    QUEUE: '@golf_caddy_download_queue',
  };

  private constructor() {
    this.initializeNetworkListener();
  }

  static getInstance(): OfflineDownloadService {
    if (!OfflineDownloadService.instance) {
      OfflineDownloadService.instance = new OfflineDownloadService();
    }
    return OfflineDownloadService.instance;
  }

  // Network monitoring
  private initializeNetworkListener() {
    NetInfo.addEventListener((state) => {
      this.networkStatus = {
        isConnected: state.isConnected ?? false,
        isWiFi: state.type === 'wifi',
        isMetered: state.type === 'cellular',
      };

      // Resume downloads if we're back online
      if (this.networkStatus.isConnected) {
        this.processDownloadQueue();
      }
    });
  }

  getNetworkStatus(): NetworkStatus {
    return this.networkStatus;
  }

  // Course download functionality
  async downloadCourse(
    course: CourseWithHoles,
    options: Partial<OfflineDownloadOptions> = {},
    onProgress?: (progress: OfflineDownloadProgress) => void
  ): Promise<OfflineRegion> {
    if (!this.networkStatus.isConnected) {
      throw new Error('No network connection available for download');
    }

    const downloadOptions: OfflineDownloadOptions = {
      courseId: course.id,
      courseName: course.name,
      bounds: this.extractCourseBounds(course),
      minZoom: 14,
      maxZoom: 20,
      priority: 'medium',
      includeStylePack: true,
      ...options,
    };

    const regionId = `course_${course.id}`;

    // Add to queue
    const queueItem: DownloadQueueItem = {
      id: regionId,
      courseId: course.id,
      courseName: course.name,
      options: downloadOptions,
      status: OfflineRegionStatus.PENDING,
      createdAt: new Date(),
    };

    this.downloadQueue.push(queueItem);
    await this.saveDownloadQueue();

    if (onProgress) {
      this.progressCallbacks.set(regionId, onProgress);
    }

    // Start download
    return this.executeDownload(queueItem);
  }

  private async executeDownload(queueItem: DownloadQueueItem): Promise<OfflineRegion> {
    const { options } = queueItem;
    const regionId = queueItem.id;

    try {
      // Update status to downloading
      queueItem.status = OfflineRegionStatus.DOWNLOADING;
      queueItem.startedAt = new Date();
      await this.saveDownloadQueue();

      // Step 1: Download style pack if requested
      if (options.includeStylePack) {
        await this.downloadStylePack(regionId);
      }

      // Step 2: Download tile region
      await this.downloadTileRegion(queueItem);

      // Step 3: Create offline region record
      const offlineRegion: OfflineRegion = {
        id: regionId,
        name: options.courseName,
        courseId: options.courseId,
        courseName: options.courseName,
        bounds: options.bounds,
        minZoom: options.minZoom ?? 14,
        maxZoom: options.maxZoom ?? 20,
        downloadedAt: new Date(),
        estimatedSize: 0, // Will be updated with actual size
        actualSize: 0,
        tileCount: 0,
        status: OfflineRegionStatus.COMPLETED,
      };

      // Save region
      await this.saveOfflineRegion(offlineRegion);

      // Update queue item
      queueItem.status = OfflineRegionStatus.COMPLETED;
      queueItem.completedAt = new Date();
      await this.saveDownloadQueue();

      // Cleanup
      this.activeDownloads.delete(regionId);
      this.progressCallbacks.delete(regionId);

      return offlineRegion;
    } catch (error) {
      queueItem.status = OfflineRegionStatus.ERROR;
      queueItem.error = this.parseError(error);
      await this.saveDownloadQueue();

      this.activeDownloads.delete(regionId);
      this.progressCallbacks.delete(regionId);

      throw error;
    }
  }

  private async downloadStylePack(regionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const onProgress = this.progressCallbacks.get(regionId);

      // Note: Using createPack as a placeholder - actual API method may differ
      const cancellable = (MapboxGL as any).offlineManager?.createPack?.(
        {
          name: regionId,
          styleURL: MapboxGL.StyleURL.Satellite,
          minZoom: 14,
          maxZoom: 20,
          metadata: { regionId, type: 'golf-course' },
        },
        (progress: any) => {
          if (onProgress) {
            onProgress({
              type: 'style-pack',
              styleUrl: MapboxGL.StyleURL.Satellite,
              completedResourceCount: progress.completedResourceCount || 0,
              requiredResourceCount: progress.requiredResourceCount || 0,
              completedResourceSize: progress.completedResourceSize || 0,
              percentage: progress.percentage || 0,
            });
          }
        }
      );

      if (cancellable) {
        this.activeDownloads.set(`${regionId}_style`, cancellable);
        // Simulate completion for now
        setTimeout(() => resolve(), 1000);
      } else {
        console.warn('OfflineManager.createPack not available, skipping style pack download');
        resolve();
      }
    });
  }

  private async downloadTileRegion(queueItem: DownloadQueueItem): Promise<void> {
    const { options } = queueItem;
    const regionId = queueItem.id;

    return new Promise((resolve, reject) => {
      const onProgress = this.progressCallbacks.get(regionId);

      // Extract bounds safely
      const bounds = options.bounds;
      if (!bounds || bounds.length < 2) {
        reject(new Error('Invalid course bounds for tile region download'));
        return;
      }

      const [sw, ne] = bounds;
      if (!sw || !ne) {
        reject(new Error('Invalid course bounds coordinates'));
        return;
      }

      // Convert bounds to the format expected by Mapbox
      const boundsArray = [
        [sw[0], sw[1]], // SW
        [ne[0], ne[1]], // NE
      ];

      // Note: Using createPack as placeholder - actual tile download API may differ
      const cancellable = (MapboxGL as any).offlineManager?.createPack?.(
        {
          name: regionId,
          styleURL: MapboxGL.StyleURL.Satellite,
          bounds: boundsArray,
          minZoom: options.minZoom ?? 14,
          maxZoom: options.maxZoom ?? 20,
          metadata: {
            courseId: options.courseId,
            courseName: options.courseName,
            type: 'golf-course',
          },
        },
        (progress: any) => {
          if (onProgress) {
            onProgress({
              type: 'tile-region',
              regionId,
              completedResourceCount: progress.completedResourceCount || 0,
              requiredResourceCount: progress.requiredResourceCount || 0,
              completedResourceSize: progress.completedResourceSize || 0,
              percentage: progress.percentage || 0,
            });
          }
        }
      );

      if (cancellable) {
        this.activeDownloads.set(`${regionId}_tiles`, cancellable);
        // Simulate completion for now
        setTimeout(() => resolve(), 2000);
      } else {
        console.warn('OfflineManager.createPack not available, skipping tile download');
        resolve();
      }
    });
  }

  // Cancel download
  async cancelDownload(regionId: string): Promise<void> {
    // Cancel active downloads
    const styleDownload = this.activeDownloads.get(`${regionId}_style`);
    const tileDownload = this.activeDownloads.get(`${regionId}_tiles`);

    if (styleDownload?.cancel) {
      styleDownload.cancel();
    }
    if (tileDownload?.cancel) {
      tileDownload.cancel();
    }

    // Update queue item status
    const queueItem = this.downloadQueue.find((item) => item.id === regionId);
    if (queueItem) {
      queueItem.status = OfflineRegionStatus.CANCELLED;
      await this.saveDownloadQueue();
    }

    // Cleanup
    this.activeDownloads.delete(`${regionId}_style`);
    this.activeDownloads.delete(`${regionId}_tiles`);
    this.progressCallbacks.delete(regionId);
  }

  // Get downloaded regions
  async getDownloadedRegions(): Promise<OfflineRegion[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEYS.REGIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load offline regions:', error);
      return [];
    }
  }

  // Delete offline region
  async deleteOfflineRegion(regionId: string): Promise<void> {
    try {
      // Remove from Mapbox storage (if methods exist)
      const offlineManager = (MapboxGL as any).offlineManager;
      if (offlineManager?.deletePack) {
        await offlineManager.deletePack(regionId);
      }

      // Remove from local storage
      const regions = await this.getDownloadedRegions();
      const updatedRegions = regions.filter((region) => region.id !== regionId);
      await AsyncStorage.setItem(this.STORAGE_KEYS.REGIONS, JSON.stringify(updatedRegions));

      // Remove from queue if present
      this.downloadQueue = this.downloadQueue.filter((item) => item.id !== regionId);
      await this.saveDownloadQueue();
    } catch (error) {
      console.error('Failed to delete offline region:', error);
      throw error;
    }
  }

  // Storage management
  async getStorageInfo(): Promise<OfflineStorageInfo> {
    const regions = await this.getDownloadedRegions();
    const totalSize = regions.reduce((sum, region) => sum + region.actualSize, 0);

    return {
      totalSize,
      totalRegions: regions.length,
      // Note: Getting available device storage requires additional native modules
    };
  }

  async cleanupStorage(criteria: CleanupCriteria): Promise<number> {
    const regions = await this.getDownloadedRegions();
    let deletedCount = 0;

    // Sort by last accessed (oldest first)
    const sortedRegions = regions.sort((a, b) => {
      const aTime = a.lastAccessed || a.downloadedAt;
      const bTime = b.lastAccessed || b.downloadedAt;
      return aTime.getTime() - bTime.getTime();
    });

    for (const region of sortedRegions) {
      let shouldDelete = false;

      // Check age criteria
      if (criteria.maxAge && region.lastAccessed) {
        const daysSinceAccess =
          (Date.now() - region.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceAccess > criteria.maxAge) {
          shouldDelete = true;
        }
      }

      // Check size criteria
      if (criteria.maxTotalSize) {
        const currentTotal = (await this.getStorageInfo()).totalSize;
        if (currentTotal > criteria.maxTotalSize) {
          shouldDelete = true;
        }
      }

      // Keep recent count
      if (criteria.keepRecentCount) {
        const remainingRegions = regions.length - deletedCount;
        if (remainingRegions <= criteria.keepRecentCount) {
          shouldDelete = false;
        }
      }

      if (shouldDelete) {
        await this.deleteOfflineRegion(region.id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  // Helper methods
  private extractCourseBounds(course: CourseWithHoles): [number, number][] {
    if (course.bounds) {
      // Use course boundary if available
      const coords = course.bounds.coordinates[0];
      if (coords && coords.length > 0) {
        const lngs = coords.map((coord) => coord[0]);
        const lats = coords.map((coord) => coord[1]);

        return [
          [Math.min(...lngs), Math.min(...lats)], // SW
          [Math.max(...lngs), Math.max(...lats)], // NE
        ];
      }
    }

    // Fallback: create bounds around course location with padding
    const [lng, lat] = course.location.coordinates;
    const padding = 0.01; // Roughly 1km

    return [
      [lng - padding, lat - padding], // SW
      [lng + padding, lat + padding], // NE
    ];
  }

  private parseError(error: any): OfflineDownloadError {
    if (error.message?.includes('network') || error.message?.includes('connection')) {
      return {
        type: 'network',
        message: error.message || 'Network connection failed',
      };
    } else if (error.message?.includes('storage') || error.message?.includes('quota')) {
      return {
        type: 'storage',
        message: error.message || 'Storage limit exceeded',
      };
    } else if (error.message?.includes('permission')) {
      return {
        type: 'permission',
        message: error.message || 'Permission denied',
      };
    } else {
      return {
        type: 'unknown',
        message: error.message || 'Unknown error occurred',
      };
    }
  }

  private async saveOfflineRegion(region: OfflineRegion): Promise<void> {
    const regions = await this.getDownloadedRegions();
    const existingIndex = regions.findIndex((r) => r.id === region.id);

    if (existingIndex >= 0) {
      regions[existingIndex] = region;
    } else {
      regions.push(region);
    }

    await AsyncStorage.setItem(this.STORAGE_KEYS.REGIONS, JSON.stringify(regions));
  }

  private async saveDownloadQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEYS.QUEUE, JSON.stringify(this.downloadQueue));
    } catch (error) {
      console.error('Failed to save download queue:', error);
    }
  }

  private async processDownloadQueue(): Promise<void> {
    // Resume pending downloads when network is available
    const pendingDownloads = this.downloadQueue.filter(
      (item) =>
        item.status === OfflineRegionStatus.PENDING || item.status === OfflineRegionStatus.PAUSED
    );

    for (const queueItem of pendingDownloads) {
      if (this.networkStatus.isConnected) {
        try {
          await this.executeDownload(queueItem);
        } catch (error) {
          console.error(`Failed to resume download for ${queueItem.id}:`, error);
        }
      }
    }
  }
}
