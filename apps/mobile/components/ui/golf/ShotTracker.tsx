import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Shot {
  id: string;
  shotNumber: number;
  clubUsed: string;
  distance?: number;
  shotType: 'tee' | 'fairway' | 'rough' | 'bunker' | 'green' | 'penalty';
  outcome: 'excellent' | 'good' | 'fair' | 'poor' | 'penalty';
  notes?: string;
  location?: { lat: number; lng: number };
}

interface ShotTrackerProps {
  holeNumber: number;
  par: number;
  shots: Shot[];
  onAddShot: (shot: Omit<Shot, 'id' | 'shotNumber'>) => void;
  onUpdateShot: (shotId: string, shot: Partial<Shot>) => void;
  onDeleteShot: (shotId: string) => void;
  className?: string;
}

const SHOT_TYPES = [
  { id: 'tee', name: 'Tee', icon: 'golf', color: 'bg-blue-100 border-blue-300' },
  { id: 'fairway', name: 'Fairway', icon: 'golf-course', color: 'bg-green-100 border-green-300' },
  { id: 'rough', name: 'Rough', icon: 'leaf', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'bunker', name: 'Bunker', icon: 'square', color: 'bg-orange-100 border-orange-300' },
  { id: 'green', name: 'Green', icon: 'flag', color: 'bg-emerald-100 border-emerald-300' },
  { id: 'penalty', name: 'Penalty', icon: 'warning', color: 'bg-red-100 border-red-300' },
];

const SHOT_OUTCOMES = [
  { id: 'excellent', name: 'Excellent', color: 'text-green-600' },
  { id: 'good', name: 'Good', color: 'text-blue-600' },
  { id: 'fair', name: 'Fair', color: 'text-yellow-600' },
  { id: 'poor', name: 'Poor', color: 'text-orange-600' },
  { id: 'penalty', name: 'Penalty', color: 'text-red-600' },
];

export const ShotTracker: React.FC<ShotTrackerProps> = ({
  holeNumber,
  par,
  shots,
  onAddShot,
  onUpdateShot,
  onDeleteShot,
  className = '',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newShot, setNewShot] = useState<Partial<Omit<Shot, 'id' | 'shotNumber'>>>({
    shotType: 'tee',
    outcome: 'good',
  });
  const [expandedShot, setExpandedShot] = useState<string | null>(null);

  const handleAddShot = () => {
    if (newShot.clubUsed && newShot.shotType && newShot.outcome) {
      onAddShot({
        clubUsed: newShot.clubUsed,
        shotType: newShot.shotType as Shot['shotType'],
        outcome: newShot.outcome as Shot['outcome'],
        ...(newShot.distance !== undefined && { distance: newShot.distance }),
        ...(newShot.notes && { notes: newShot.notes }),
      });
      setNewShot({ shotType: 'fairway', outcome: 'good' });
      setIsAdding(false);
    }
  };

  const getShotTypeInfo = (type: Shot['shotType']) => {
    return SHOT_TYPES.find((t) => t.id === type) || SHOT_TYPES[0];
  };

  const getOutcomeInfo = (outcome: Shot['outcome']) => {
    return SHOT_OUTCOMES.find((o) => o.id === outcome) || SHOT_OUTCOMES[0];
  };

  return (
    <View className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-lg font-semibold text-gray-800">
            Hole {holeNumber} - Par {par}
          </Text>
          <Text className="text-sm text-gray-600">
            {shots.length} shot{shots.length !== 1 ? 's' : ''} recorded
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsAdding(!isAdding)}
          className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-medium ml-1">Add Shot</Text>
        </TouchableOpacity>
      </View>

      {/* Add Shot Form */}
      {isAdding && (
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">New Shot</Text>

          {/* Club Input */}
          <TextInput
            value={newShot.clubUsed || ''}
            onChangeText={(text) => setNewShot({ ...newShot, clubUsed: text })}
            placeholder="Club used (e.g., 7I, Driver)"
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
          />

          {/* Shot Type */}
          <Text className="text-xs text-gray-600 mb-1">Shot Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2">
              {SHOT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setNewShot({ ...newShot, shotType: type.id as Shot['shotType'] })}
                  className={`px-3 py-2 rounded-lg border-2 ${
                    newShot.shotType === type.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      newShot.shotType === type.id ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Outcome */}
          <Text className="text-xs text-gray-600 mb-1">Outcome</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {SHOT_OUTCOMES.map((outcome) => (
              <TouchableOpacity
                key={outcome.id}
                onPress={() => setNewShot({ ...newShot, outcome: outcome.id as Shot['outcome'] })}
                className={`px-3 py-1 rounded-lg ${
                  newShot.outcome === outcome.id ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm ${
                    newShot.outcome === outcome.id ? 'text-white' : outcome.color
                  }`}
                >
                  {outcome.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Distance */}
          <TextInput
            value={newShot.distance?.toString() || ''}
            onChangeText={(text) => {
              const newDistance = text ? parseInt(text) : undefined;
              setNewShot((prev) => ({
                ...prev,
                ...(newDistance !== undefined ? { distance: newDistance } : {}),
              }));
            }}
            placeholder="Distance (yards)"
            keyboardType="numeric"
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
          />

          {/* Notes */}
          <TextInput
            value={newShot.notes || ''}
            onChangeText={(text) => setNewShot({ ...newShot, notes: text })}
            placeholder="Notes (optional)"
            multiline
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3 h-16"
          />

          {/* Action Buttons */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleAddShot}
              disabled={!newShot.clubUsed}
              className={`flex-1 py-2 rounded-lg ${
                newShot.clubUsed ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <Text className="text-white text-center font-medium">Save Shot</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsAdding(false);
                setNewShot({ shotType: 'tee', outcome: 'good' });
              }}
              className="flex-1 bg-gray-400 py-2 rounded-lg"
            >
              <Text className="text-white text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Shot List */}
      <ScrollView className="max-h-96">
        {shots.map((shot, index) => {
          const shotType = getShotTypeInfo(shot.shotType);
          const outcome = getOutcomeInfo(shot.outcome);
          const isExpanded = expandedShot === shot.id;

          return (
            <TouchableOpacity
              key={shot.id}
              onPress={() => setExpandedShot(isExpanded ? null : shot.id)}
              className="border-b border-gray-200 py-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      shot.shotNumber === 1 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  >
                    <Text className="text-white font-bold text-sm">{shot.shotNumber}</Text>
                  </View>

                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-medium text-gray-800">{shot.clubUsed}</Text>
                      <Text className={`ml-2 text-sm ${outcome?.color || 'text-gray-600'}`}>
                        {outcome?.name || 'Unknown'}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <View
                        className={`px-2 py-1 rounded-full ${shotType?.color || 'bg-gray-100 border-gray-300'}`}
                      >
                        <Text className="text-xs text-gray-700">{shotType?.name || 'Unknown'}</Text>
                      </View>
                      {shot.distance && (
                        <Text className="ml-2 text-xs text-gray-600">{shot.distance} yards</Text>
                      )}
                    </View>
                  </View>
                </View>

                <TouchableOpacity onPress={() => onDeleteShot(shot.id)} className="ml-2 p-2">
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              {isExpanded && shot.notes && (
                <View className="mt-2 ml-11 p-2 bg-gray-50 rounded">
                  <Text className="text-sm text-gray-600">{shot.notes}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
