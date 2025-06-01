// Offline map download and management types

export interface DownloadProgress {
  completedResourceCount: number;
  requiredResourceCount: number;
  completedResourceSize: number; // In bytes
  percentage: number; // 0-100
}

export interface StylePackDownloadProgress extends DownloadProgress {
  type: 'style-pack';
  styleUrl: string;
}

export interface TileRegionDownloadProgress extends DownloadProgress {
  type: 'tile-region';
  regionId: string;
}

export type OfflineDownloadProgress = StylePackDownloadProgress | TileRegionDownloadProgress;

export interface OfflineRegion {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  bounds: [number, number][]; // [[lng, lat], [lng, lat]] - SW and NE corners
  minZoom: number;
  maxZoom: number;
  downloadedAt: Date;
  lastAccessed?: Date;
  estimatedSize: number; // In bytes
  actualSize: number; // In bytes
  tileCount: number;
  status: OfflineRegionStatus;
}

export enum OfflineRegionStatus {
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  ERROR = 'error',
  CANCELLED = 'cancelled',
}

export interface OfflineDownloadOptions {
  courseId: string;
  courseName: string;
  bounds: [number, number][]; // Course boundary coordinates
  minZoom?: number; // Default: 14
  maxZoom?: number; // Default: 20
  priority?: 'high' | 'medium' | 'low'; // Default: 'medium'
  includeStylePack?: boolean; // Default: true
}

export interface OfflineStorageInfo {
  totalSize: number; // Total storage used in bytes
  totalRegions: number;
  availableSpace?: number; // Available device storage in bytes
  quota?: number; // Storage quota in bytes (if set)
}

export interface NetworkStatus {
  isConnected: boolean;
  isWiFi: boolean;
  isMetered: boolean; // Cellular data that may have usage limits
}

export interface OfflineDownloadError {
  type: 'network' | 'storage' | 'permission' | 'mapbox' | 'unknown';
  message: string;
  regionId?: string;
  courseId?: string;
}

// Download queue management
export interface DownloadQueueItem {
  id: string;
  courseId: string;
  courseName: string;
  options: OfflineDownloadOptions;
  status: OfflineRegionStatus;
  progress?: OfflineDownloadProgress;
  error?: OfflineDownloadError;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// Storage cleanup criteria
export interface CleanupCriteria {
  maxAge?: number; // Days since last access
  maxTotalSize?: number; // Total storage limit in bytes
  keepRecentCount?: number; // Always keep N most recently accessed
}
