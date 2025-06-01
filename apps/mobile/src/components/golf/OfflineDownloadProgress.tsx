import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Progress,
  ProgressFilledTrack,
  Pressable,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import type { OfflineDownloadProgress, OfflineRegionStatus } from '../../types/offline';

interface OfflineDownloadProgressProps {
  courseName: string;
  status: OfflineRegionStatus;
  progress?: OfflineDownloadProgress | undefined;
  estimatedSize?: number | undefined;
  onPause?: (() => void) | undefined;
  onResume?: (() => void) | undefined;
  onCancel?: (() => void) | undefined;
  showDetails?: boolean;
}

export const OfflineDownloadProgressComponent: React.FC<OfflineDownloadProgressProps> = ({
  courseName,
  status,
  progress,
  estimatedSize,
  onPause,
  onResume,
  onCancel,
  showDetails = true,
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          icon: 'download-outline' as const,
          color: '#3b82f6',
          bgColor: '#dbeafe',
          text: 'Queued',
        };
      case 'downloading':
        return {
          icon: 'download' as const,
          color: '#3b82f6',
          bgColor: '#dbeafe',
          text: 'Downloading...',
        };
      case 'paused':
        return {
          icon: 'pause' as const,
          color: '#f59e0b',
          bgColor: '#fef3c7',
          text: 'Paused',
        };
      case 'completed':
        return {
          icon: 'checkmark-circle' as const,
          color: '#10b981',
          bgColor: '#d1fae5',
          text: 'Downloaded',
        };
      case 'error':
        return {
          icon: 'alert-circle' as const,
          color: '#ef4444',
          bgColor: '#fee2e2',
          text: 'Error',
        };
      case 'cancelled':
        return {
          icon: 'close-circle' as const,
          color: '#6b7280',
          bgColor: '#f3f4f6',
          text: 'Cancelled',
        };
      default:
        return {
          icon: 'download-outline' as const,
          color: '#3b82f6',
          bgColor: '#dbeafe',
          text: 'Unknown',
        };
    }
  };

  const statusInfo = getStatusInfo();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getProgressPercentage = (): number => {
    if (!progress) return 0;
    return Math.min(progress.percentage, 100);
  };

  const canPause = status === 'downloading';
  const canResume = status === 'paused';
  const canCancel = ['pending', 'downloading', 'paused'].includes(status);

  return (
    <Box className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <VStack className="gap-3">
        {/* Header */}
        <HStack className="justify-between items-center">
          <HStack className="flex-1 items-center gap-3">
            <Box
              className="w-10 h-10 rounded-full justify-center items-center"
              style={{ backgroundColor: statusInfo.bgColor }}
            >
              <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
            </Box>

            <VStack className="flex-1">
              <Text className="font-semibold text-gray-900" numberOfLines={1}>
                {courseName}
              </Text>
              <Text className="text-sm text-gray-600">{statusInfo.text}</Text>
            </VStack>
          </HStack>

          {/* Action Buttons */}
          <HStack className="gap-2">
            {canPause && onPause && (
              <Pressable onPress={onPause}>
                <Box className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center">
                  <Ionicons name="pause" size={16} color="#4b5563" />
                </Box>
              </Pressable>
            )}

            {canResume && onResume && (
              <Pressable onPress={onResume}>
                <Box className="w-8 h-8 rounded-full bg-blue-100 justify-center items-center">
                  <Ionicons name="play" size={16} color="#2563eb" />
                </Box>
              </Pressable>
            )}

            {canCancel && onCancel && (
              <Pressable onPress={onCancel}>
                <Box className="w-8 h-8 rounded-full bg-red-100 justify-center items-center">
                  <Ionicons name="close" size={16} color="#dc2626" />
                </Box>
              </Pressable>
            )}
          </HStack>
        </HStack>

        {/* Progress Bar */}
        {(status === 'downloading' || status === 'paused') && (
          <VStack className="gap-1">
            <Progress value={getProgressPercentage()} className="w-full">
              <ProgressFilledTrack />
            </Progress>

            {showDetails && progress && (
              <HStack className="justify-between">
                <Text className="text-xs text-gray-500">
                  {progress.completedResourceCount} of {progress.requiredResourceCount} tiles
                </Text>
                <Text className="text-xs text-gray-500">{getProgressPercentage().toFixed(0)}%</Text>
              </HStack>
            )}
          </VStack>
        )}

        {/* Download Details */}
        {showDetails && (
          <VStack className="gap-1">
            {progress?.completedResourceSize && (
              <HStack className="justify-between">
                <Text className="text-xs text-gray-500">Downloaded:</Text>
                <Text className="text-xs text-gray-500">
                  {formatBytes(progress.completedResourceSize)}
                  {estimatedSize && ` / ${formatBytes(estimatedSize)}`}
                </Text>
              </HStack>
            )}

            {progress?.type && (
              <HStack className="justify-between">
                <Text className="text-xs text-gray-500">Type:</Text>
                <Text className="text-xs text-gray-500">
                  {progress.type === 'style-pack' ? 'Style Pack' : 'Map Tiles'}
                </Text>
              </HStack>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

// Download Queue List Component
interface DownloadQueueListProps {
  downloads: Array<{
    id: string;
    courseName: string;
    status: OfflineRegionStatus;
    progress?: OfflineDownloadProgress;
    estimatedSize?: number;
  }>;
  onPauseDownload?: (id: string) => void;
  onResumeDownload?: (id: string) => void;
  onCancelDownload?: (id: string) => void;
}

export const DownloadQueueList: React.FC<DownloadQueueListProps> = ({
  downloads,
  onPauseDownload,
  onResumeDownload,
  onCancelDownload,
}) => {
  if (downloads.length === 0) {
    return (
      <Box className="p-8 items-center">
        <Ionicons name="download-outline" size={48} color="#9ca3af" />
        <Text className="text-gray-500 text-center mt-2">No downloads in queue</Text>
        <Text className="text-gray-400 text-center text-sm mt-1">
          Start downloading a course to see progress here
        </Text>
      </Box>
    );
  }

  return (
    <VStack className="gap-3">
      {downloads.map((download) => (
        <OfflineDownloadProgressComponent
          key={download.id}
          courseName={download.courseName}
          status={download.status}
          progress={download.progress}
          estimatedSize={download.estimatedSize}
          onPause={onPauseDownload ? () => onPauseDownload(download.id) : undefined}
          onResume={onResumeDownload ? () => onResumeDownload(download.id) : undefined}
          onCancel={onCancelDownload ? () => onCancelDownload(download.id) : undefined}
          showDetails={true}
        />
      ))}
    </VStack>
  );
};
