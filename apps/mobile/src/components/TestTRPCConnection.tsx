/**
 * Golf Caddy tRPC Connection Test Component
 *
 * This component tests the tRPC connection and demonstrates
 * basic API functionality for development and debugging.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useCourses, useRecentRounds, TRPCConfig, useTRPCErrorHandler } from '../hooks/api';

export function TestTRPCConnection() {
  const { getErrorMessage } = useTRPCErrorHandler();

  // Test course fetching
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useCourses();

  // Test round fetching
  const {
    data: rounds,
    isLoading: roundsLoading,
    error: roundsError,
    refetch: refetchRounds,
  } = useRecentRounds();

  const handleTestConnection = () => {
    console.log('🔧 Testing tRPC connection...');
    refetchCourses();
    refetchRounds();
  };

  const getStatusIndicator = (isLoading: boolean, error: any, data: any) => {
    if (isLoading) return { text: '⏳ Loading...', color: '#f59e0b' };
    if (error) return { text: '❌ Error', color: '#ef4444' };
    if (data) return { text: '✅ Connected', color: '#10b981' };
    return { text: '⚪ Not tested', color: '#6b7280' };
  };

  const coursesStatus = getStatusIndicator(coursesLoading, coursesError, courses);
  const roundsStatus = getStatusIndicator(roundsLoading, roundsError, rounds);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔌 tRPC Connection Test</Text>
        <Text style={styles.subtitle}>Golf Caddy API Integration</Text>
      </View>

      {/* Configuration Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Configuration</Text>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>API URL:</Text>
          <Text style={styles.configValue}>{TRPCConfig.apiUrl}</Text>
        </View>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Environment:</Text>
          <Text style={styles.configValue}>{TRPCConfig.environment}</Text>
        </View>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Timeout:</Text>
          <Text style={styles.configValue}>{TRPCConfig.timeout}ms</Text>
        </View>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Debug Mode:</Text>
          <Text style={styles.configValue}>{TRPCConfig.debugMode ? 'ON' : 'OFF'}</Text>
        </View>
      </View>

      {/* Connection Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 API Tests</Text>

        {/* Courses Test */}
        <View style={styles.testRow}>
          <Text style={styles.testLabel}>Courses API:</Text>
          <Text style={[styles.testStatus, { color: coursesStatus.color }]}>
            {coursesStatus.text}
          </Text>
        </View>
        {courses && <Text style={styles.testDetails}>Found {courses.length} courses</Text>}
        {coursesError && <Text style={styles.errorText}>{getErrorMessage(coursesError)}</Text>}

        {/* Rounds Test */}
        <View style={styles.testRow}>
          <Text style={styles.testLabel}>Rounds API:</Text>
          <Text style={[styles.testStatus, { color: roundsStatus.color }]}>
            {roundsStatus.text}
          </Text>
        </View>
        {rounds && <Text style={styles.testDetails}>Found {rounds.length} recent rounds</Text>}
        {roundsError && <Text style={styles.errorText}>{getErrorMessage(roundsError)}</Text>}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleTestConnection}>
          <Text style={styles.buttonText}>🔄 Test Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            console.log('📱 tRPC Config:', TRPCConfig);
            console.log('📊 Courses:', courses);
            console.log('🏌️ Rounds:', rounds);
          }}
        >
          <Text style={styles.buttonText}>📋 Log Details</Text>
        </TouchableOpacity>
      </View>

      {/* Development Info */}
      {__DEV__ && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Development Info</Text>
          <Text style={styles.devText}>• tRPC endpoint: {TRPCConfig.endpoint}</Text>
          <Text style={styles.devText}>• Stale time: {TRPCConfig.staleTime}ms</Text>
          <Text style={styles.devText}>• GC time: {TRPCConfig.gcTime}ms</Text>
          <Text style={styles.devText}>• Retries: {TRPCConfig.retries}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  configLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  configValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  testRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  testLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  testStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  testDetails: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 8,
    marginLeft: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 8,
    marginLeft: 12,
  },
  actions: {
    margin: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  devText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default TestTRPCConnection;
