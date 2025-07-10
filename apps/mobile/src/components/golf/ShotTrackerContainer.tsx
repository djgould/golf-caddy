/**
 * ShotTracker Container
 * 
 * This component handles the data fetching and state management for the ShotTracker UI component.
 * It connects the ShotTracker to the tRPC API and provides the necessary props.
 */

import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { ShotTracker } from '../../../components/ui/golf/ShotTracker';
import { 
  useShotsForHole, 
  useCreateShot, 
  useUpdateShot, 
  useDeleteShot,
  useRoundById,
  useCourse
} from '@/src/hooks/api';

interface ShotTrackerContainerProps {
  roundId: string;
  holeNumber: number;
  par?: number;
}

interface Shot {
  id: string;
  shotNumber: number;
  clubUsed: string;
  distance?: number;
  shotType: 'tee' | 'fairway' | 'rough' | 'bunker' | 'green' | 'penalty';
  outcome: 'excellent' | 'good' | 'fair' | 'poor' | 'penalty';
  notes?: string;
  location?: { lat: number; lng: number };
}

export function ShotTrackerContainer({ roundId, holeNumber, par = 4 }: ShotTrackerContainerProps) {
  // Get round data to access course ID
  const { data: round } = useRoundById(roundId);
  
  // Get course data separately to ensure we have holes information
  const { data: course } = useCourse(round?.courseId || '');
  
  // Find the current hole data
  const currentHoleData = useMemo(() => {
    return course?.holes?.find((h: any) => h.holeNumber === holeNumber);
  }, [course, holeNumber]);
  
  // Get shots for this hole
  const { data: shotsData, isLoading: shotsLoading, refetch: refetchShots } = useShotsForHole(
    roundId, 
    currentHoleData?.id || ''
  );
  
  // Mutations
  const createShot = useCreateShot();
  const updateShot = useUpdateShot();
  const deleteShot = useDeleteShot();
  
  // Transform API shots to UI format
  const shots: Shot[] = useMemo(() => {
    if (!shotsData?.shots) return [];
    
    return shotsData.shots.map((apiShot: any) => ({
      id: apiShot.id,
      shotNumber: apiShot.shotNumber,
      clubUsed: apiShot.club,
      distance: apiShot.distance || undefined,
      shotType: mapApiResultToShotType(apiShot.result),
      outcome: 'good', // Default for now, could map from result
      notes: apiShot.notes || undefined,
      location: apiShot.startLocation ? {
        lat: apiShot.startLocation.lat,
        lng: apiShot.startLocation.lng
      } : undefined
    }));
  }, [shotsData]);
  
  const isLoading = shotsLoading || createShot.isPending || updateShot.isPending || deleteShot.isPending;

  const handleAddShot = async (shot: Omit<Shot, 'id' | 'shotNumber'>) => {
    if (!currentHoleData) {
      Alert.alert('Error', 'Hole information not available');
      return;
    }
    
    try {
      // Get the highest shot number from API data, not UI state
      const existingShots = shotsData?.shots || [];
      const maxShotNumber = existingShots.length > 0 
        ? Math.max(...existingShots.map(s => s.shotNumber))
        : 0;
      const nextShotNumber = maxShotNumber + 1;
      
      console.log('Adding shot - existing shots:', existingShots.length, 'max shot number:', maxShotNumber, 'next shot number:', nextShotNumber);
      
      await createShot.mutateAsync({
        roundId,
        holeId: currentHoleData.id,
        shotNumber: nextShotNumber,
        club: mapClubNameToApiFormat(shot.clubUsed),
        distance: shot.distance,
        startLocation: shot.location || { lat: 0, lng: 0 }, // Default location for now
        result: mapShotTypeToApiResult(shot.shotType),
        notes: shot.notes
      });
    } catch (error) {
      console.error('Failed to add shot:', error);
      Alert.alert('Error', 'Failed to add shot. Please try again.');
    }
  };

  const handleUpdateShot = async (shotId: string, shotUpdates: Partial<Shot>) => {
    try {
      const updateData: any = {};
      
      if (shotUpdates.clubUsed) updateData.club = mapClubNameToApiFormat(shotUpdates.clubUsed);
      if (shotUpdates.distance !== undefined) updateData.distance = shotUpdates.distance;
      if (shotUpdates.shotType) updateData.result = mapShotTypeToApiResult(shotUpdates.shotType);
      if (shotUpdates.notes !== undefined) updateData.notes = shotUpdates.notes;
      if (shotUpdates.location) {
        updateData.startLocation = {
          lat: shotUpdates.location.lat,
          lng: shotUpdates.location.lng
        };
      }
      
      await updateShot.mutateAsync({ id: shotId, ...updateData });
    } catch (error) {
      console.error('Failed to update shot:', error);
      Alert.alert('Error', 'Failed to update shot. Please try again.');
    }
  };

  const handleDeleteShot = async (shotId: string) => {
    try {
      await deleteShot.mutateAsync({ id: shotId });
    } catch (error) {
      console.error('Failed to delete shot:', error);
      Alert.alert('Error', 'Failed to delete shot. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 8, color: '#6b7280' }}>Loading shots...</Text>
      </View>
    );
  }

  return (
    <ShotTracker
      holeNumber={holeNumber}
      par={par}
      shots={shots}
      onAddShot={handleAddShot}
      onUpdateShot={handleUpdateShot}
      onDeleteShot={handleDeleteShot}
    />
  );
}

// Helper functions to map between API and UI formats
function mapApiResultToShotType(result: string | null): Shot['shotType'] {
  switch (result) {
    case 'fairway': return 'fairway';
    case 'rough': return 'rough';
    case 'bunker': return 'bunker';
    case 'green': return 'green';
    case 'water':
    case 'out-of-bounds': return 'penalty';
    default: return 'tee';
  }
}

function mapShotTypeToApiResult(shotType: Shot['shotType']): string {
  switch (shotType) {
    case 'fairway': return 'fairway';
    case 'rough': return 'rough';
    case 'bunker': return 'bunker';
    case 'green': return 'green';
    case 'penalty': return 'water';
    default: return 'fairway';
  }
}

function mapClubNameToApiFormat(clubName: string): string {
  const normalized = clubName.toLowerCase().trim();
  
  // Handle common abbreviations and formats
  const clubMappings: Record<string, string> = {
    // Drivers & Woods
    'd': 'driver',
    'dr': 'driver',
    'driver': 'driver',
    '3w': '3-wood',
    '3-w': '3-wood',
    '3 wood': '3-wood',
    '5w': '5-wood',
    '5-w': '5-wood',
    '5 wood': '5-wood',
    '7w': '7-wood',
    '7-w': '7-wood',
    '7 wood': '7-wood',
    
    // Hybrids
    '1h': '1-hybrid',
    '1-h': '1-hybrid',
    '1 hybrid': '1-hybrid',
    '2h': '2-hybrid',
    '2-h': '2-hybrid',
    '2 hybrid': '2-hybrid',
    '3h': '3-hybrid',
    '3-h': '3-hybrid',
    '3 hybrid': '3-hybrid',
    '4h': '4-hybrid',
    '4-h': '4-hybrid',
    '4 hybrid': '4-hybrid',
    '5h': '5-hybrid',
    '5-h': '5-hybrid',
    '5 hybrid': '5-hybrid',
    
    // Irons
    '1i': '1-iron',
    '1-i': '1-iron',
    '1 iron': '1-iron',
    '2i': '2-iron',
    '2-i': '2-iron',
    '2 iron': '2-iron',
    '3i': '3-iron',
    '3-i': '3-iron',
    '3 iron': '3-iron',
    '4i': '4-iron',
    '4-i': '4-iron',
    '4 iron': '4-iron',
    '5i': '5-iron',
    '5-i': '5-iron',
    '5 iron': '5-iron',
    '6i': '6-iron',
    '6-i': '6-iron',
    '6 iron': '6-iron',
    '7i': '7-iron',
    '7-i': '7-iron',
    '7 iron': '7-iron',
    '8i': '8-iron',
    '8-i': '8-iron',
    '8 iron': '8-iron',
    '9i': '9-iron',
    '9-i': '9-iron',
    '9 iron': '9-iron',
    
    // Wedges
    'pw': 'pitching-wedge',
    'pitching': 'pitching-wedge',
    'gw': 'gap-wedge',
    'gap': 'gap-wedge',
    'sw': 'sand-wedge',
    'sand': 'sand-wedge',
    'lw': 'lob-wedge',
    'lob': 'lob-wedge',
    
    // Putter
    'putter': 'putter',
    'pt': 'putter',
  };
  
  // Check direct mapping first
  if (clubMappings[normalized]) {
    return clubMappings[normalized];
  }
  
  // If no mapping found, return 'other'
  return 'other';
}