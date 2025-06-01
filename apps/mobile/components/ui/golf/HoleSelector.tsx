import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HoleSelectorProps {
  currentHole: number;
  completedHoles?: number[];
  onSelectHole: (hole: number) => void;
  className?: string;
  horizontal?: boolean;
}

export const HoleSelector: React.FC<HoleSelectorProps> = ({
  currentHole,
  completedHoles = [],
  onSelectHole,
  className = '',
  horizontal = false,
}) => {
  const holes = Array.from({ length: 18 }, (_, i) => i + 1);

  const renderHole = (hole: number) => {
    const isCompleted = completedHoles.includes(hole);
    const isCurrent = hole === currentHole;
    const isNext = hole === currentHole + 1;

    return (
      <TouchableOpacity
        key={hole}
        onPress={() => onSelectHole(hole)}
        className={`
          ${horizontal ? 'mx-1' : 'm-1'}
          ${isCurrent ? 'bg-green-500' : isCompleted ? 'bg-green-100' : 'bg-white'}
          ${isNext && !isCompleted ? 'border-2 border-green-400' : 'border border-gray-200'}
          rounded-xl shadow-sm
          ${horizontal ? 'w-12 h-12' : 'w-14 h-14'}
          items-center justify-center
        `}
      >
        {isCompleted && !isCurrent ? (
          <Ionicons name="checkmark-circle" size={horizontal ? 20 : 24} color="#10b981" />
        ) : (
          <Text
            className={`
              ${horizontal ? 'text-sm' : 'text-base'}
              font-bold
              ${isCurrent ? 'text-white' : isCompleted ? 'text-green-700' : 'text-gray-700'}
            `}
          >
            {hole}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={`bg-gray-50 py-2 ${className}`}
      >
        <View className="flex-row px-2">{holes.map(renderHole)}</View>
      </ScrollView>
    );
  }

  return (
    <View className={`bg-gray-50 p-4 ${className}`}>
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-800">Select Hole</Text>
        <Text className="text-sm text-gray-600">{completedHoles.length}/18 completed</Text>
      </View>

      <View className="flex-row flex-wrap">
        <View className="w-full">
          <Text className="text-xs text-gray-500 mb-2">Front 9</Text>
          <View className="flex-row flex-wrap mb-4">{holes.slice(0, 9).map(renderHole)}</View>
        </View>

        <View className="w-full">
          <Text className="text-xs text-gray-500 mb-2">Back 9</Text>
          <View className="flex-row flex-wrap">{holes.slice(9).map(renderHole)}</View>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-around">
        <TouchableOpacity
          onPress={() => currentHole > 1 && onSelectHole(currentHole - 1)}
          disabled={currentHole === 1}
          className={`flex-row items-center px-4 py-2 rounded-lg ${
            currentHole === 1 ? 'bg-gray-100' : 'bg-gray-200'
          }`}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentHole === 1 ? '#9ca3af' : '#374151'}
          />
          <Text className={`ml-1 ${currentHole === 1 ? 'text-gray-400' : 'text-gray-700'}`}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => currentHole < 18 && onSelectHole(currentHole + 1)}
          disabled={currentHole === 18}
          className={`flex-row items-center px-4 py-2 rounded-lg ${
            currentHole === 18 ? 'bg-gray-100' : 'bg-green-500'
          }`}
        >
          <Text className={`mr-1 ${currentHole === 18 ? 'text-gray-400' : 'text-white'}`}>
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentHole === 18 ? '#9ca3af' : 'white'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
