import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoundById } from '@/src/hooks/api';
import { ScoreCard } from '@/components/ui/golf';

export default function RoundSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: round, isLoading, error } = useRoundById(id || '');

  const handleDone = () => {
    router.replace('/(tabs)/round');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading summary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !round) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load round summary</Text>
          <Pressable style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const totalScore = round.totalScore || 0;
  const coursePar = round.course?.par || 72;
  const scoreRelativeToPar = totalScore - coursePar;
  const scoreDisplay = scoreRelativeToPar > 0 ? `+${scoreRelativeToPar}` : scoreRelativeToPar.toString();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Round Summary',
          headerLeft: () => null,
          gestureEnabled: false,
        }} 
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="check-circle" size={64} color="#10b981" />
          <Text style={styles.completedText}>Round Completed!</Text>
          <Text style={styles.courseText}>{round.course?.name}</Text>
          <Text style={styles.dateText}>
            {new Date(round.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.scoreOverview}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Total Score</Text>
            <Text style={styles.scoreValue}>{totalScore || '-'}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>To Par</Text>
            <Text style={[
              styles.scoreValue,
              scoreRelativeToPar < 0 && styles.underPar,
              scoreRelativeToPar > 0 && styles.overPar,
            ]}>
              {totalScore ? scoreDisplay : '-'}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Course Par</Text>
            <Text style={styles.scoreValue}>{coursePar}</Text>
          </View>
        </View>

        <View style={styles.scorecardContainer}>
          <Text style={styles.sectionTitle}>Scorecard</Text>
          <ScoreCard roundId={id!} />
        </View>

        {round.weather && (
          <View style={styles.conditionsContainer}>
            <Text style={styles.sectionTitle}>Conditions</Text>
            <View style={styles.conditionRow}>
              <Text style={styles.conditionLabel}>Weather</Text>
              <Text style={styles.conditionValue}>
                {round.weather.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
            {round.temperature && (
              <View style={styles.conditionRow}>
                <Text style={styles.conditionLabel}>Temperature</Text>
                <Text style={styles.conditionValue}>{round.temperature}°F</Text>
              </View>
            )}
          </View>
        )}

        {round.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{round.notes}</Text>
          </View>
        )}

        <Pressable style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
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
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  completedText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  courseText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  scoreOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 24,
    marginVertical: 8,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  underPar: {
    color: '#10b981',
  },
  overPar: {
    color: '#ef4444',
  },
  scorecardContainer: {
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
  conditionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  conditionLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  conditionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  notesContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  notesText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});