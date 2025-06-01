import React from 'react';
import { View } from 'react-native';
import { MonorepoIntegrationExample } from '../../components/examples/MonorepoIntegrationExample';

export default function TestScreen() {
  return (
    <View className="flex-1">
      <MonorepoIntegrationExample />
    </View>
  );
}
