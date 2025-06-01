import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Club {
  id: string;
  name: string;
  abbreviation: string;
  category: 'driver' | 'wood' | 'hybrid' | 'iron' | 'wedge' | 'putter';
  icon?: string;
}

interface ClubSelectorProps {
  selectedClub?: string;
  onSelectClub: (clubId: string) => void;
  className?: string;
}

const CLUBS: Club[] = [
  // Woods
  { id: 'driver', name: 'Driver', abbreviation: 'D', category: 'driver' },
  { id: '3w', name: '3 Wood', abbreviation: '3W', category: 'wood' },
  { id: '5w', name: '5 Wood', abbreviation: '5W', category: 'wood' },

  // Hybrids
  { id: '3h', name: '3 Hybrid', abbreviation: '3H', category: 'hybrid' },
  { id: '4h', name: '4 Hybrid', abbreviation: '4H', category: 'hybrid' },

  // Irons
  { id: '3i', name: '3 Iron', abbreviation: '3I', category: 'iron' },
  { id: '4i', name: '4 Iron', abbreviation: '4I', category: 'iron' },
  { id: '5i', name: '5 Iron', abbreviation: '5I', category: 'iron' },
  { id: '6i', name: '6 Iron', abbreviation: '6I', category: 'iron' },
  { id: '7i', name: '7 Iron', abbreviation: '7I', category: 'iron' },
  { id: '8i', name: '8 Iron', abbreviation: '8I', category: 'iron' },
  { id: '9i', name: '9 Iron', abbreviation: '9I', category: 'iron' },

  // Wedges
  { id: 'pw', name: 'Pitching Wedge', abbreviation: 'PW', category: 'wedge' },
  { id: 'aw', name: 'Approach Wedge', abbreviation: 'AW', category: 'wedge' },
  { id: 'sw', name: 'Sand Wedge', abbreviation: 'SW', category: 'wedge' },
  { id: 'lw', name: 'Lob Wedge', abbreviation: 'LW', category: 'wedge' },

  // Putter
  { id: 'putter', name: 'Putter', abbreviation: 'P', category: 'putter' },
];

const CATEGORY_COLORS = {
  driver: 'bg-red-100 border-red-300',
  wood: 'bg-orange-100 border-orange-300',
  hybrid: 'bg-yellow-100 border-yellow-300',
  iron: 'bg-blue-100 border-blue-300',
  wedge: 'bg-purple-100 border-purple-300',
  putter: 'bg-green-100 border-green-300',
};

const CATEGORY_COLORS_SELECTED = {
  driver: 'bg-red-500',
  wood: 'bg-orange-500',
  hybrid: 'bg-yellow-500',
  iron: 'bg-blue-500',
  wedge: 'bg-purple-500',
  putter: 'bg-green-500',
};

export const ClubSelector: React.FC<ClubSelectorProps> = ({
  selectedClub,
  onSelectClub,
  className = '',
}) => {
  const categories = [
    { name: 'Driver', clubs: CLUBS.filter((c) => c.category === 'driver') },
    { name: 'Woods', clubs: CLUBS.filter((c) => c.category === 'wood') },
    { name: 'Hybrids', clubs: CLUBS.filter((c) => c.category === 'hybrid') },
    { name: 'Irons', clubs: CLUBS.filter((c) => c.category === 'iron') },
    { name: 'Wedges', clubs: CLUBS.filter((c) => c.category === 'wedge') },
    { name: 'Putter', clubs: CLUBS.filter((c) => c.category === 'putter') },
  ];

  return (
    <ScrollView className={`bg-gray-50 ${className}`} showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {categories.map((category) => (
          <View key={category.name} className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">{category.name}</Text>
            <View className="flex-row flex-wrap gap-2">
              {category.clubs.map((club) => {
                const isSelected = selectedClub === club.id;
                return (
                  <TouchableOpacity
                    key={club.id}
                    onPress={() => onSelectClub(club.id)}
                    className={`w-16 h-16 rounded-xl items-center justify-center border-2 ${
                      isSelected
                        ? CATEGORY_COLORS_SELECTED[club.category]
                        : CATEGORY_COLORS[club.category]
                    }`}
                  >
                    <Text
                      className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}
                    >
                      {club.abbreviation}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
