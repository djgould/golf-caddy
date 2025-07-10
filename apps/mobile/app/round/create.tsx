import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCreateRound } from '@/src/hooks/api';

const WEATHER_CONDITIONS = [
  { value: 'sunny', label: 'Sunny', icon: 'wb-sunny' },
  { value: 'partly_cloudy', label: 'Partly Cloudy', icon: 'wb-cloudy' },
  { value: 'cloudy', label: 'Cloudy', icon: 'cloud' },
  { value: 'rainy', label: 'Rainy', icon: 'grain' },
  { value: 'windy', label: 'Windy', icon: 'air' },
] as const;

export default function CreateRoundScreen() {
  const params = useLocalSearchParams<{ courseId: string; courseName: string }>();
  const [weather, setWeather] = useState<string>('sunny');
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');
  
  const createRound = useCreateRound();

  const handleCreateRound = async () => {
    if (!params.courseId) {
      Alert.alert('Error', 'No course selected');
      return;
    }

    try {
      const newRound = await createRound.mutateAsync({
        courseId: params.courseId,
        weather,
        temperature: temperature ? parseInt(temperature) : undefined,
        notes: notes || undefined,
      });

      // Navigate to the active round screen
      router.replace({
        pathname: '/round/[id]',
        params: { id: newRound.id },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create round. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'New Round',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#111827" />
            </Pressable>
          ),
        }} 
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course</Text>
          <View style={styles.courseCard}>
            <MaterialIcons name="golf-course" size={24} color="#10b981" />
            <Text style={styles.courseName}>{params.courseName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Conditions</Text>
          <View style={styles.weatherGrid}>
            {WEATHER_CONDITIONS.map((condition) => (
              <Pressable
                key={condition.value}
                style={[
                  styles.weatherOption,
                  weather === condition.value && styles.weatherOptionSelected,
                ]}
                onPress={() => setWeather(condition.value)}
              >
                <MaterialIcons
                  name={condition.icon as any}
                  size={24}
                  color={weather === condition.value ? '#fff' : '#6b7280'}
                />
                <Text
                  style={[
                    styles.weatherLabel,
                    weather === condition.value && styles.weatherLabelSelected,
                  ]}
                >
                  {condition.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperature (°F)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter temperature (optional)"
            value={temperature}
            onChangeText={setTemperature}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any notes about conditions, goals, etc."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Pressable
          style={[styles.startButton, createRound.isPending && styles.buttonDisabled]}
          onPress={handleCreateRound}
          disabled={createRound.isPending}
        >
          {createRound.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="play-arrow" size={24} color="#fff" />
              <Text style={styles.startButtonText}>Start Round</Text>
            </>
          )}
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
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weatherOption: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 90,
  },
  weatherOptionSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  weatherLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  weatherLabelSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});