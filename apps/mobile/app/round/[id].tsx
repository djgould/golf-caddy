import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoundById, useUpdateRound, useQuickScore, useHoleScore } from '@/src/hooks/api';
import { ShotTrackerContainer } from '@/src/components/golf/ShotTrackerContainer';

export default function ActiveRoundScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentHole, setCurrentHole] = useState(1);
  
  const { data: round, isLoading, error } = useRoundById(id || '');
  const updateRound = useUpdateRound();
  const { saveQuickScore, isLoading: scoreSaving } = useQuickScore();
  
  // Calculate current hole data
  const currentHoleData = round?.course?.holes?.find(h => h.holeNumber === currentHole);
  
  // Get hole score for current hole - this must be called before any conditional returns
  const { data: currentHoleScore, hasScore } = useHoleScore(id || '', currentHoleData?.id || '');
  

  const handlePreviousHole = () => {
    if (currentHole > 1) {
      setCurrentHole(currentHole - 1);
    }
  };

  const handleNextHole = () => {
    if (currentHole < 18) {
      setCurrentHole(currentHole + 1);
    }
  };

  const handleEndRound = () => {
    Alert.alert(
      'End Round',
      'Are you sure you want to end this round?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Round',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateRound.mutateAsync({
                id: id!,
                endTime: new Date(),
              });
              router.replace('/round/summary/' + id);
            } catch (error) {
              Alert.alert('Error', 'Failed to end round');
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading round...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !round) {
    const errorMessage = error?.message || 'Failed to load round';
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load round</Text>
          <Text style={styles.errorSubtext}>{errorMessage}</Text>
          <Text style={styles.errorSubtext}>Round ID: {id}</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }


  const handleScoreButton = async (scoreDiff: number) => {
    if (!currentHoleData || !id) return;
    
    try {
      await saveQuickScore(id, currentHoleData.id, currentHoleData.par, scoreDiff);
    } catch (error) {
      Alert.alert('Error', 'Failed to save score. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: round.course?.name || 'Active Round',
          headerRight: () => (
            <Pressable onPress={handleEndRound}>
              <Text style={styles.endButton}>End</Text>
            </Pressable>
          ),
        }} 
      />

      <View style={styles.holeNavigation}>
        <Pressable 
          onPress={handlePreviousHole}
          disabled={currentHole === 1}
          style={[styles.navButton, currentHole === 1 && styles.navButtonDisabled]}
        >
          <MaterialIcons 
            name="chevron-left" 
            size={24} 
            color={currentHole === 1 ? '#d1d5db' : '#111827'} 
          />
        </Pressable>

        <View style={styles.holeInfo}>
          <Text style={styles.holeNumber}>Hole {currentHole}</Text>
          {currentHoleData && (
            <Text style={styles.holePar}>Par {currentHoleData.par}</Text>
          )}
        </View>

        <Pressable 
          onPress={handleNextHole}
          disabled={currentHole === 18}
          style={[styles.navButton, currentHole === 18 && styles.navButtonDisabled]}
        >
          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={currentHole === 18 ? '#d1d5db' : '#111827'} 
          />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.holeDetails}>
          {currentHoleData && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>
                  {Math.round(currentHoleData.yardage || 0)} yards
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Handicap</Text>
                <Text style={styles.detailValue}>
                  {currentHoleData.handicap || '-'}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.shotTrackerContainer}>
          <Text style={styles.sectionTitle}>Shot Tracking</Text>
          <ShotTrackerContainer 
            roundId={id!}
            holeNumber={currentHole}
            par={currentHoleData?.par}
          />
        </View>

        <View style={styles.quickScore}>
          <Text style={styles.sectionTitle}>Quick Score</Text>
          <View style={styles.scoreButtons}>
            {[-2, -1, 0, 1, 2].map((score) => {
              const par = currentHoleData?.par || 4;
              const strokes = par + score;
              let label = '';
              if (score === -2) label = 'Eagle';
              else if (score === -1) label = 'Birdie';
              else if (score === 0) label = 'Par';
              else if (score === 1) label = 'Bogey';
              else if (score === 2) label = 'Double';

              const isSelected = hasScore && currentHoleScore?.score === strokes;
              
              return (
                <Pressable 
                  key={score} 
                  style={[
                    styles.scoreButton,
                    isSelected && styles.scoreButtonSelected,
                    scoreSaving && styles.scoreButtonDisabled
                  ]}
                  onPress={() => handleScoreButton(score)}
                  disabled={scoreSaving}
                >
                  <Text style={[
                    styles.scoreNumber,
                    isSelected && styles.scoreNumberSelected
                  ]}>
                    {strokes}
                  </Text>
                  <Text style={[
                    styles.scoreLabel,
                    isSelected && styles.scoreLabelSelected
                  ]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  endButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  holeNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  holeInfo: {
    alignItems: 'center',
  },
  holeNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  holePar: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  holeDetails: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  shotTrackerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickScore: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  scoreButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: 60,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scoreButtonSelected: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  scoreButtonDisabled: {
    opacity: 0.5,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  scoreNumberSelected: {
    color: '#ffffff',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  scoreLabelSelected: {
    color: '#ffffff',
  },
});