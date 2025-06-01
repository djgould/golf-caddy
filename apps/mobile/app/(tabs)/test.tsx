import React from 'react';
import { View, ScrollView } from 'react-native';
import { MonorepoIntegrationExample } from '../../components/examples/MonorepoIntegrationExample';
import { TestTRPCConnection } from '../../src/components/TestTRPCConnection';

export default function TestScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <TestTRPCConnection />
      <View className="p-4">
        <MonorepoIntegrationExample />
      </View>
    </ScrollView>
  );
}
