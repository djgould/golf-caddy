import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
  getScoreLabel,
  calculateStablefordPoints,
  calculateHandicapIndex,
  isValidScore,
  formatDate,
  getRelativeTime,
} from '@repo/utils';
import { ScoreInput } from '../ui/golf';

export const MonorepoIntegrationExample: React.FC = () => {
  const [score, setScore] = useState(4);
  const [par, setPar] = useState(4);
  const [handicapScores] = useState([75.2, 78.1, 72.5, 81.3, 76.8, 79.5, 74.3, 77.6, 73.2, 80.1]);

  // Using date utilities from shared package
  const now = new Date();
  const formattedDate = formatDate(now, 'MMMM d, yyyy');
  const relativeTime = getRelativeTime(new Date(Date.now() - 3600000)); // 1 hour ago

  // Using golf scoring utilities
  const scoreLabel = getScoreLabel(score, par);
  const stablefordPoints = calculateStablefordPoints(score, par, 0);
  const isValid = isValidScore(score, par);

  // Calculate handicap index
  const handicapIndex = calculateHandicapIndex(handicapScores);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-bold mb-6">Monorepo Integration Test</Text>

        {/* Date Utils Section */}
        <View className="mb-8 p-4 bg-gray-100 rounded-lg">
          <Text className="text-lg font-semibold mb-2">📅 Date Utilities (@repo/utils)</Text>
          <Text className="text-gray-700">Current Date: {formattedDate}</Text>
          <Text className="text-gray-700">Relative Time Example: {relativeTime}</Text>
        </View>

        {/* Golf Scoring Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4">⛳ Golf Scoring Utilities</Text>

          <View className="mb-4">
            <Text className="mb-2">Hole Par: {par}</Text>
            <View className="flex-row gap-2">
              {[3, 4, 5].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPar(p)}
                  className={`px-4 py-2 rounded ${par === p ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <Text className={`font-semibold ${par === p ? 'text-white' : 'text-gray-700'}`}>
                    Par {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="mb-2">Your Score:</Text>
            <ScoreInput value={score} onChange={setScore} par={par} holeNumber={1} />
          </View>

          {/* Results from utilities */}
          <View className="p-4 bg-blue-50 rounded-lg">
            <Text className="font-semibold mb-2">Results from @repo/utils:</Text>
            <Text className="text-gray-700">
              • Score Label: <Text className="font-bold">{scoreLabel}</Text>
            </Text>
            <Text className="text-gray-700">
              • Stableford Points: <Text className="font-bold">{stablefordPoints}</Text>
            </Text>
            <Text className="text-gray-700">
              • Valid Score: <Text className="font-bold">{isValid ? 'Yes' : 'No'}</Text>
            </Text>
          </View>
        </View>

        {/* Handicap Calculation */}
        <View className="mb-8 p-4 bg-green-50 rounded-lg">
          <Text className="text-lg font-semibold mb-2">🏌️ Handicap Calculator</Text>
          <Text className="text-gray-700 mb-2">Recent Scores (Differentials):</Text>
          <Text className="text-sm text-gray-600 mb-2">{handicapScores.join(', ')}</Text>
          <Text className="text-gray-700">
            Calculated Handicap Index:{' '}
            <Text className="font-bold text-lg">{handicapIndex.toFixed(1)}</Text>
          </Text>
        </View>

        {/* Integration Status */}
        <View className="p-4 bg-green-100 rounded-lg">
          <Text className="text-green-800 font-semibold">✓ Monorepo Integration Working!</Text>
          <Text className="text-green-700 text-sm mt-1">
            Successfully importing and using utilities from @repo/utils package
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
