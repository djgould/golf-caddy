import React from 'react';
import { View, Text } from 'react-native';
import { createLogger, logInfo, LogLevel } from '@repo/logger';
import { loadConfigFromEnv, AppConfigSchema } from '@repo/config';
import { formatDate, calculateHandicapIndex, isValidEmail } from '@repo/utils';

// Test logger functionality
const logger = createLogger({
  level: LogLevel.INFO,
  service: 'test-app',
  environment: 'development',
});

// Test the utilities
export const TestUtilities: React.FC = () => {
  // Test date formatting
  const now = new Date();
  const formattedDate = formatDate(now, 'long');

  // Test golf scoring
  const scores = [85, 87, 83, 89, 82, 88, 84, 86];
  let handicap = 0;
  try {
    handicap = calculateHandicapIndex(scores);
  } catch (error) {
    console.error('Handicap calculation error:', error);
  }

  // Test validation
  const email = 'test@example.com';
  const isValid = isValidEmail(email);

  // Test logging
  logInfo('Test utilities loaded successfully', {
    feature: 'test-app',
    action: 'utilities-test',
  });

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Utility Test Results:</Text>
      <Text>Date: {formattedDate}</Text>
      <Text>Handicap Index: {handicap.toFixed(1)}</Text>
      <Text>
        Email Validation: {email} is {isValid ? 'valid' : 'invalid'}
      </Text>
      <Text>Logger: Created with level {LogLevel.INFO}</Text>
    </View>
  );
};

// Type check to ensure imports work
const typeCheck: typeof logger = createLogger();
console.log('All imports working correctly!');
