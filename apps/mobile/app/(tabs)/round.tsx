import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRounds } from '@/src/hooks/api';

export default function RoundScreen() {
  const { data: rounds, isLoading } = useRounds();
  
  const activeRounds = rounds?.rounds.filter(r => !r.endTime) || [];
  const recentRounds = rounds?.rounds.filter(r => r.endTime).slice(0, 5) || [];

  const handleStartRound = () => {
    router.push('/round/select-course');
  };

  const handleResumeRound = (roundId: string) => {
    router.push(`/round/${roundId}`);
  };

  const handleViewRound = (roundId: string) => {
    router.push(`/round/summary/${roundId}`);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Round Tracking</Text>
      
      {activeRounds.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Rounds</Text>
          {activeRounds.map((round) => (
            <Pressable
              key={round.id}
              style={styles.roundCard}
              onPress={() => handleResumeRound(round.id)}
            >
              <View style={styles.roundInfo}>
                <Text style={styles.courseName}>{round.course?.name}</Text>
                <Text style={styles.roundDate}>
                  Started {new Date(round.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={styles.subtitle}>No active round</Text>
      )}

      <Pressable style={styles.button} onPress={handleStartRound}>
        <MaterialIcons name="play-arrow" size={24} color="#fff" />
        <Text style={styles.buttonText}>Start New Round</Text>
      </Pressable>

      {recentRounds.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Rounds</Text>
          {recentRounds.map((round) => (
            <Pressable
              key={round.id}
              style={styles.roundCard}
              onPress={() => handleViewRound(round.id)}
            >
              <View style={styles.roundInfo}>
                <Text style={styles.courseName}>{round.course?.name}</Text>
                <View style={styles.roundStats}>
                  <Text style={styles.roundDate}>
                    {new Date(round.createdAt).toLocaleDateString()}
                  </Text>
                  {round.totalScore && (
                    <Text style={styles.roundScore}>
                      Score: {round.totalScore}
                    </Text>
                  )}
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  roundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  roundInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roundDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  roundStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  roundScore: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
