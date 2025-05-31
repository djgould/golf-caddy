import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserPreferences,
  DEFAULT_CLUB_DISTANCES,
  DistanceUnit,
  ClubDistances,
} from '../types/stores';

interface UserPreferencesStore extends UserPreferences {
  // Actions
  setDistanceUnit: (unit: DistanceUnit) => void;
  setClubDistance: (club: string, distance: number) => void;
  setClubDistances: (distances: ClubDistances) => void;
  setAutoTrackLocation: (enabled: boolean) => void;
  setHighAccuracyGPS: (enabled: boolean) => void;
  setUserProfile: (profile: Partial<Pick<UserPreferences, 'name' | 'email' | 'handicap'>>) => void;
  resetToDefaults: () => void;

  // Utility functions
  convertDistanceToMeters: (yards: number) => number;
  convertDistanceToYards: (meters: number) => number;
  getClubDistanceInCurrentUnit: (club: string) => number;
}

const convertYardsToMeters = (yards: number): number => Math.round(yards * 0.9144);
const convertMetersToYards = (meters: number): number => Math.round(meters * 1.09361);

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      distanceUnit: 'yards' as DistanceUnit,
      clubDistances: DEFAULT_CLUB_DISTANCES,
      autoTrackLocation: true,
      highAccuracyGPS: true,

      // Actions
      setDistanceUnit: (unit) => {
        const currentState = get();
        const newDistances: ClubDistances = {};

        // Convert all club distances to the new unit
        Object.entries(currentState.clubDistances).forEach(([club, distance]) => {
          if (currentState.distanceUnit === 'yards' && unit === 'meters') {
            newDistances[club] = convertYardsToMeters(distance);
          } else if (currentState.distanceUnit === 'meters' && unit === 'yards') {
            newDistances[club] = convertMetersToYards(distance);
          } else {
            newDistances[club] = distance;
          }
        });

        set({ distanceUnit: unit, clubDistances: newDistances });
      },

      setClubDistance: (club, distance) =>
        set((state) => ({
          clubDistances: {
            ...state.clubDistances,
            [club]: distance,
          },
        })),

      setClubDistances: (distances) => set({ clubDistances: distances }),

      setAutoTrackLocation: (enabled) => set({ autoTrackLocation: enabled }),

      setHighAccuracyGPS: (enabled) => set({ highAccuracyGPS: enabled }),

      setUserProfile: (profile) =>
        set((state) => ({
          ...state,
          ...profile,
        })),

      resetToDefaults: () => {
        const { name, email, handicap, ...currentState } = get();
        set({
          distanceUnit: 'yards' as DistanceUnit,
          clubDistances: DEFAULT_CLUB_DISTANCES,
          autoTrackLocation: true,
          highAccuracyGPS: true,
        });
      },

      // Utility functions
      convertDistanceToMeters: convertYardsToMeters,
      convertDistanceToYards: convertMetersToYards,

      getClubDistanceInCurrentUnit: (club) => {
        const state = get();
        return state.clubDistances[club] || 0;
      },
    }),
    {
      name: 'user-preferences-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist data, not functions
        distanceUnit: state.distanceUnit,
        clubDistances: state.clubDistances,
        autoTrackLocation: state.autoTrackLocation,
        highAccuracyGPS: state.highAccuracyGPS,
        name: state.name,
        email: state.email,
        handicap: state.handicap,
      }),
    }
  )
);
