import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Box, Text, Button, VStack, HStack, Pressable } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkAwareDownloads } from '../../hooks/useOfflineDownloads';
import { OfflineDownloadProgressComponent } from './OfflineDownloadProgress';
import { OfflineRegionStatus } from '../../types/offline';
import type { CourseWithHoles } from '../../types/golf';
import type { OfflineDownloadProgress } from '../../types/offline';

interface OfflineDownloadButtonProps {
  course: CourseWithHoles;
  compact?: boolean;
  showProgress?: boolean;
}

export const OfflineDownloadButton: React.FC<OfflineDownloadButtonProps> = ({
  course,
  compact = false,
  showProgress = true,
}) => {
  const {
    downloadedRegions,
    downloadCourseIfOnline,
    deleteOfflineRegion,
    canDownload,
    isOnWiFi,
    isOnCellular,
    networkStatus,
    isLoading,
  } = useNetworkAwareDownloads();

  const [downloadProgress, setDownloadProgress] = useState<OfflineDownloadProgress | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const regionId = `course_${course.id}`;
  const isDownloaded = downloadedRegions.some((region) => region.id === regionId);

  const handleDownload = async () => {
    if (!canDownload) {
      Alert.alert(
        'No Internet Connection',
        'Please connect to the internet to download offline maps.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isOnCellular) {
      Alert.alert(
        'Cellular Data Warning',
        'You are connected to cellular data. Downloading maps may use significant data. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: startDownload },
        ]
      );
      return;
    }

    startDownload();
  };

  const startDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(null);

      await downloadCourseIfOnline(course, (progress) => {
        setDownloadProgress(progress);
      });

      Alert.alert('Download Complete', `${course.name} is now available offline!`, [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert(
        'Download Failed',
        error instanceof Error ? error.message : 'Failed to download course.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Offline Map', `Remove ${course.name} from offline storage?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOfflineRegion(regionId);
          } catch (error) {
            Alert.alert('Delete Failed', 'Failed to remove offline map.', [{ text: 'OK' }]);
          }
        },
      },
    ]);
  };

  if (compact) {
    return (
      <Pressable onPress={isDownloaded ? handleDelete : handleDownload}>
        <Box className="flex-row items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <Ionicons
            name={isDownloaded ? 'checkmark-circle' : 'download-outline'}
            size={16}
            color={isDownloaded ? '#10b981' : '#3b82f6'}
          />
          <Text className="text-sm font-medium">{isDownloaded ? 'Downloaded' : 'Download'}</Text>
        </Box>
      </Pressable>
    );
  }

  return (
    <VStack className="gap-3">
      {/* Network Status */}
      <HStack className="items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <Ionicons
          name={networkStatus.isConnected ? 'wifi' : 'wifi-outline'}
          size={16}
          color={networkStatus.isConnected ? '#10b981' : '#ef4444'}
        />
        <Text className="text-sm flex-1">
          {networkStatus.isConnected
            ? isOnWiFi
              ? 'Connected to WiFi'
              : 'Connected to Cellular'
            : 'No Internet Connection'}
        </Text>
      </HStack>

      {/* Download Progress */}
      {isDownloading && downloadProgress && showProgress && (
        <OfflineDownloadProgressComponent
          courseName={course.name}
          status={OfflineRegionStatus.DOWNLOADING}
          progress={downloadProgress}
          showDetails={true}
        />
      )}

      {/* Download/Delete Button */}
      {isDownloaded ? (
        <VStack className="gap-2">
          <HStack className="items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text className="text-green-700 flex-1 font-medium">Available Offline</Text>
          </HStack>

          <Button
            onPress={handleDelete}
            disabled={isLoading}
            className="border border-red-300 bg-white"
          >
            <HStack className="items-center gap-2">
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text className="text-red-600">Remove Offline Map</Text>
            </HStack>
          </Button>
        </VStack>
      ) : (
        <Button
          onPress={handleDownload}
          disabled={!canDownload || isDownloading || isLoading}
          className={!canDownload || isDownloading ? 'opacity-50' : ''}
        >
          <HStack className="items-center gap-2">
            <Ionicons name="download" size={16} color="white" />
            <Text className="text-white font-medium">
              {isDownloading ? 'Downloading...' : 'Download for Offline'}
            </Text>
          </HStack>
        </Button>
      )}

      {/* Download Info */}
      <Text className="text-xs text-gray-500 text-center">
        Offline maps include satellite imagery and course details for use without internet
        connection.
      </Text>
    </VStack>
  );
};
