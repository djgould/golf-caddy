import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Golf Caddy</Text>
        <Text style={styles.subtitle}>Your smart golf companion</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Link href="/map" asChild>
          <Pressable style={styles.card}>
            <MaterialIcons name="map" size={32} color="#10b981" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Course Map</Text>
              <Text style={styles.cardDescription}>View satellite maps and distances</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/round" asChild>
          <Pressable style={styles.card}>
            <MaterialIcons name="golf-course" size={32} color="#10b981" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Start Round</Text>
              <Text style={styles.cardDescription}>Track your shots and score</Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});
