import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useUserPreferencesStore } from '../../src/stores';

export default function SettingsScreen() {
  const {
    distanceUnit,
    autoTrackLocation,
    highAccuracyGPS,
    setDistanceUnit,
    setAutoTrackLocation,
    setHighAccuracyGPS,
  } = useUserPreferencesStore();

  const toggleDistanceUnit = () => {
    setDistanceUnit(distanceUnit === 'yards' ? 'meters' : 'yards');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display Preferences</Text>

        <TouchableOpacity style={styles.settingRow} onPress={toggleDistanceUnit}>
          <View>
            <Text style={styles.settingLabel}>Distance Unit</Text>
            <Text style={styles.settingDescription}>Toggle between yards and meters</Text>
          </View>
          <View style={styles.toggleButton}>
            <Text style={styles.toggleText}>{distanceUnit}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Settings</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto-Track Location</Text>
            <Text style={styles.settingDescription}>
              Automatically start tracking when app opens
            </Text>
          </View>
          <Switch
            value={autoTrackLocation}
            onValueChange={setAutoTrackLocation}
            trackColor={{ false: '#767577', true: '#10b981' }}
            thumbColor={autoTrackLocation ? '#065f46' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>High Accuracy GPS</Text>
            <Text style={styles.settingDescription}>Use best accuracy (uses more battery)</Text>
          </View>
          <Switch
            value={highAccuracyGPS}
            onValueChange={setHighAccuracyGPS}
            trackColor={{ false: '#767577', true: '#10b981' }}
            thumbColor={highAccuracyGPS ? '#065f46' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club Distances</Text>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Manage Club Distances</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  toggleButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af',
  },
});
