import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface ScoreInputProps {
  value: number;
  onChange: (value: number) => void;
  holeNumber: number;
  par: number;
  onFocus?: () => void;
  className?: string;
}

const COMMON_SCORES = ['Eagle', 'Birdie', 'Par', 'Bogey', 'Double'];

export const ScoreInput: React.FC<ScoreInputProps> = ({
  value,
  onChange,
  holeNumber,
  par,
  onFocus,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useSharedValue(0);

  const handleScoreChange = (newScore: number) => {
    if (newScore >= 1 && newScore <= 12) {
      onChange(newScore);
    }
  };

  const handlePresetScore = (preset: string) => {
    const scoreMap: Record<string, number> = {
      Eagle: par - 2,
      Birdie: par - 1,
      Par: par,
      Bogey: par + 1,
      Double: par + 2,
    };
    const score = scoreMap[preset];
    if (score !== undefined) {
      onChange(score);
      setIsExpanded(false);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e: PanGestureHandlerEventPayload) => {
      translateY.value = Math.max(-50, Math.min(50, e.translationY));
    })
    .onEnd((e: PanGestureHandlerEventPayload) => {
      'worklet';
      if (e.translationY < -20) {
        runOnJS(handleScoreChange)(value + 1);
      } else if (e.translationY > 20) {
        runOnJS(handleScoreChange)(value - 1);
      }
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const getScoreColor = () => {
    if (value < par) return 'text-red-600';
    if (value === par) return 'text-green-600';
    if (value === par + 1) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = () => {
    const diff = value - par;
    if (diff === -2) return 'Eagle';
    if (diff === -1) return 'Birdie';
    if (diff === 0) return 'Par';
    if (diff === 1) return 'Bogey';
    if (diff === 2) return 'Double';
    if (diff > 2) return `+${diff}`;
    return `${diff}`;
  };

  return (
    <View className={`items-center ${className}`}>
      <Text className="text-sm text-gray-600 mb-1">Hole {holeNumber}</Text>
      <Text className="text-xs text-gray-500 mb-2">Par {par}</Text>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={() => {
              onFocus?.();
              setIsExpanded(!isExpanded);
            }}
            className={`w-20 h-20 rounded-2xl bg-white shadow-md items-center justify-center border-2 ${
              isExpanded ? 'border-green-500' : 'border-gray-200'
            }`}
          >
            <Text className={`text-3xl font-bold ${getScoreColor()}`}>{value}</Text>
            <Text className={`text-xs ${getScoreColor()}`}>{getScoreLabel()}</Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      <View className="flex-row mt-2 gap-1">
        <TouchableOpacity
          onPress={() => handleScoreChange(value - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
        >
          <Text className="text-lg font-bold text-gray-700">-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleScoreChange(value + 1)}
          className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
        >
          <Text className="text-lg font-bold text-gray-700">+</Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View className="absolute top-full mt-2 bg-white rounded-xl shadow-lg p-2 z-50">
          <View className="flex-row flex-wrap gap-1 max-w-xs">
            {COMMON_SCORES.map((score) => (
              <TouchableOpacity
                key={score}
                onPress={() => handlePresetScore(score)}
                className="px-3 py-2 bg-gray-100 rounded-lg"
              >
                <Text className="text-sm font-medium text-gray-700">{score}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row flex-wrap gap-1 mt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => {
                  onChange(num);
                  setIsExpanded(false);
                }}
                className={`w-10 h-10 rounded-lg items-center justify-center ${
                  num === value ? 'bg-green-500' : 'bg-gray-100'
                }`}
              >
                <Text className={`font-medium ${num === value ? 'text-white' : 'text-gray-700'}`}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
