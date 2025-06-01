import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DistanceDisplayProps {
  distance: number; // in yards
  unit?: 'yards' | 'meters';
  onUnitChange?: (unit: 'yards' | 'meters') => void;
  label?: string;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const YARDS_TO_METERS = 0.9144;

export const DistanceDisplay: React.FC<DistanceDisplayProps> = ({
  distance,
  unit = 'yards',
  onUnitChange,
  label,
  showIcon = true,
  size = 'medium',
  className = '',
}) => {
  const [currentUnit, setCurrentUnit] = useState(unit);

  useEffect(() => {
    setCurrentUnit(unit);
  }, [unit]);

  const toggleUnit = () => {
    const newUnit = currentUnit === 'yards' ? 'meters' : 'yards';
    setCurrentUnit(newUnit);
    onUnitChange?.(newUnit);
  };

  const displayDistance =
    currentUnit === 'yards' ? distance : Math.round(distance * YARDS_TO_METERS);

  const getDistanceColor = () => {
    if (distance < 100) return 'text-green-600';
    if (distance < 150) return 'text-blue-600';
    if (distance < 200) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-3 py-2',
          distance: 'text-2xl',
          unit: 'text-sm',
          label: 'text-xs',
        };
      case 'large':
        return {
          container: 'px-6 py-4',
          distance: 'text-5xl',
          unit: 'text-lg',
          label: 'text-base',
        };
      default:
        return {
          container: 'px-4 py-3',
          distance: 'text-3xl',
          unit: 'text-base',
          label: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <View className={`bg-white rounded-xl shadow-md ${sizeClasses.container} ${className}`}>
      {label && <Text className={`${sizeClasses.label} text-gray-600 mb-1`}>{label}</Text>}

      <View className="flex-row items-baseline justify-center">
        {showIcon && (
          <Ionicons
            name="flag"
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color="#10b981"
            style={{ marginRight: 8 }}
          />
        )}

        <Text className={`${sizeClasses.distance} font-bold ${getDistanceColor()}`}>
          {displayDistance}
        </Text>

        <TouchableOpacity onPress={toggleUnit} className="ml-2" disabled={!onUnitChange}>
          <Text
            className={`${sizeClasses.unit} ${onUnitChange ? 'text-blue-600' : 'text-gray-600'}`}
          >
            {currentUnit === 'yards' ? 'yd' : 'm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Visual distance indicator */}
      <View className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${
            distance < 100
              ? 'bg-green-500'
              : distance < 150
                ? 'bg-blue-500'
                : distance < 200
                  ? 'bg-yellow-500'
                  : 'bg-orange-500'
          }`}
          style={{
            width: `${Math.min((distance / 300) * 100, 100)}%`,
          }}
        />
      </View>

      {/* Distance markers */}
      <View className="flex-row justify-between mt-1">
        <Text className="text-xs text-gray-400">0</Text>
        <Text className="text-xs text-gray-400">150</Text>
        <Text className="text-xs text-gray-400">300+</Text>
      </View>
    </View>
  );
};
