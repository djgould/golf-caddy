import React from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { useLocation } from '../../src/hooks/useLocation';
import { useUserPreferencesStore } from '../../src/stores';

export default function MapScreen() {
  const {
    currentPosition,
    isTracking,
    hasPermission,
    error,
    requestPermission,
    startTracking,
    stopTracking,
  } = useLocation({
    enableMockMode: __DEV__, // Use mock location in development
  });

  const { distanceUnit } = useUserPreferencesStore();

  const handleLocationPermission = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to use the golf caddy features.'
      );
    }
  };

  const handleToggleTracking = async () => {
    if (isTracking) {
      await stopTracking();
    } else {
      if (!hasPermission) {
        await handleLocationPermission();
        return;
      }
      await startTracking();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Golf Course Map</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Location Status:</Text>
        <Text style={styles.value}>
          {hasPermission ? 'Permission Granted' : 'Permission Required'}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tracking:</Text>
        <Text style={styles.value}>{isTracking ? 'Active' : 'Inactive'}</Text>
      </View>

      {currentPosition && (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Current Position:</Text>
            <Text style={styles.value}>
              {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
            </Text>
          </View>

          {currentPosition.accuracy && (
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.value}>±{Math.round(currentPosition.accuracy)} meters</Text>
            </View>
          )}
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Distance Unit:</Text>
        <Text style={styles.value}>{distanceUnit}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!hasPermission && (
          <Button title="Request Location Permission" onPress={handleLocationPermission} />
        )}

        <Button
          title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
          onPress={handleToggleTracking}
          disabled={!hasPermission && isTracking}
        />
      </View>

      <Text style={styles.note}>
        {__DEV__ ? '📍 Using mock location (Pebble Beach)' : '📍 Using real GPS'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  note: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});
