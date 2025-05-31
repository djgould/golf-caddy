import { create } from 'zustand';
import { AppState } from '../types/stores';

interface AppStateStore extends AppState {
  // Actions
  setLoading: (isLoading: boolean) => void;
  setOffline: (isOffline: boolean) => void;
  setCurrentCourse: (courseId: string | undefined) => void;
  setCurrentHole: (holeNumber: number | undefined) => void;
  setLocationPermission: (hasPermission: boolean) => void;
  setTrackingLocation: (isTracking: boolean) => void;
  setActiveRound: (roundId: string | undefined) => void;
  setError: (error: string | undefined) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState: AppState = {
  isLoading: false,
  isOffline: false,
  hasLocationPermission: false,
  isTrackingLocation: false,
};

export const useAppStateStore = create<AppStateStore>((set) => ({
  // Initial state
  ...initialState,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),

  setOffline: (isOffline) => set({ isOffline }),

  setCurrentCourse: (courseId) =>
    set((state) => {
      if (courseId === undefined) {
        const { currentCourseId, ...rest } = state;
        return rest;
      }
      return { currentCourseId: courseId };
    }),

  setCurrentHole: (holeNumber) =>
    set((state) => {
      if (holeNumber === undefined) {
        const { currentHoleNumber, ...rest } = state;
        return rest;
      }
      return { currentHoleNumber: holeNumber };
    }),

  setLocationPermission: (hasPermission) => set({ hasLocationPermission: hasPermission }),

  setTrackingLocation: (isTracking) => set({ isTrackingLocation: isTracking }),

  setActiveRound: (roundId) =>
    set((state) => {
      if (roundId === undefined) {
        const { activeRoundId, ...rest } = state;
        return rest;
      }
      return { activeRoundId: roundId };
    }),

  setError: (error) =>
    set((state) => {
      if (error === undefined) {
        const { lastError, ...rest } = state;
        return rest;
      }
      return {
        lastError: {
          message: error,
          timestamp: new Date(),
        },
      };
    }),

  clearError: () =>
    set((state) => {
      const { lastError, ...rest } = state;
      return rest;
    }),

  resetState: () => set(initialState),
}));
