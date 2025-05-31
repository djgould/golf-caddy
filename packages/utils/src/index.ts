// @repo/utils - Shared utilities and business logic for Golf Caddy
export const UtilsVersion = '0.0.0';

// Date formatting utilities
export * from './formatting/date';

// Golf-specific utilities
export * from './golf/scoring';

// Validation utilities
export * from './validation/common';

// Re-export specific functions for convenience
export { formatDate, getRelativeTime, formatDuration } from './formatting/date';
export {
  getScoreLabel,
  calculateStablefordPoints,
  calculateHandicapIndex,
  calculateCourseHandicap,
  isValidScore,
  type ScoreType,
} from './golf/scoring';
export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isInRange,
  isValidLength,
  validatePassword,
} from './validation/common';
