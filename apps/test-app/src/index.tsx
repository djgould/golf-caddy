import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@repo/ui';
import { UIVersion } from '@repo/ui';
import { UtilsVersion } from '@repo/utils';

// Test component that uses cross-package imports
export const TestApp: React.FC = () => {
  const handlePress = () => {
    console.log('Button pressed!');
    console.log(`UI Package Version: ${UIVersion}`);
    console.log(`Utils Package Version: ${UtilsVersion}`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Cross-Package Import Test</Text>

      <Button
        title="Primary Button"
        variant="primary"
        onPress={handlePress}
        style={{ marginBottom: 10 }}
      />

      <Button title="Secondary Button" variant="secondary" onPress={handlePress} />

      <Text style={{ marginTop: 20, color: '#666' }}>This app successfully imports from:</Text>
      <Text style={{ color: '#666' }}>• @repo/ui (v{UIVersion})</Text>
      <Text style={{ color: '#666' }}>• @repo/utils (v{UtilsVersion})</Text>
    </View>
  );
};

// Type check: Ensure TypeScript path aliases work
const testTypeImport: typeof Button = Button;
console.log('Type import successful:', !!testTypeImport);
