// Golf scoring utilities

export type ScoreType = 'stroke' | 'stableford' | 'match';

/**
 * Calculate the score relative to par
 * @param strokes - Number of strokes taken
 * @param par - Par for the hole/course
 * @returns Score relative to par with appropriate label
 */
export const getScoreLabel = (strokes: number, par: number): string => {
  const diff = strokes - par;

  if (diff === -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double Bogey';
  if (diff === 3) return 'Triple Bogey';

  return diff > 0 ? `+${diff}` : `${diff}`;
};

/**
 * Calculate Stableford points for a hole
 * @param strokes - Number of strokes taken
 * @param par - Par for the hole
 * @param strokesReceived - Handicap strokes received on the hole
 * @returns Stableford points
 */
export const calculateStablefordPoints = (
  strokes: number,
  par: number,
  strokesReceived: number = 0
): number => {
  const netStrokes = strokes - strokesReceived;
  const diff = netStrokes - par;

  if (diff <= -2) return 5; // Eagle or better
  if (diff === -1) return 4; // Birdie
  if (diff === 0) return 3; // Par
  if (diff === 1) return 2; // Bogey
  if (diff === 2) return 1; // Double Bogey

  return 0; // Triple Bogey or worse
};

/**
 * Calculate basic handicap index (simplified version)
 * @param scores - Array of recent scores (differentials)
 * @returns Handicap index
 */
export const calculateHandicapIndex = (scores: number[]): number => {
  if (scores.length < 5) {
    throw new Error('Need at least 5 scores to calculate handicap');
  }

  // Sort scores and take the best ones based on total count
  const sortedScores = [...scores].sort((a, b) => a - b);
  let numToUse: number;

  if (scores.length >= 20) numToUse = 8;
  else if (scores.length >= 15) numToUse = 6;
  else if (scores.length >= 10) numToUse = 4;
  else if (scores.length >= 7) numToUse = 2;
  else numToUse = 1;

  const bestScores = sortedScores.slice(0, numToUse);
  const average = bestScores.reduce((sum, score) => sum + score, 0) / numToUse;

  // Apply the 0.96 factor and round to 1 decimal place
  return Math.round(average * 0.96 * 10) / 10;
};

/**
 * Calculate course handicap from handicap index
 * @param handicapIndex - Player's handicap index
 * @param slopeRating - Course slope rating (default 113)
 * @param courseRating - Course rating
 * @param par - Course par
 * @returns Course handicap
 */
export const calculateCourseHandicap = (
  handicapIndex: number,
  slopeRating: number = 113,
  courseRating: number,
  par: number
): number => {
  const courseHandicap = (handicapIndex * slopeRating) / 113 + (courseRating - par);
  return Math.round(courseHandicap);
};

/**
 * Validate golf score for a hole
 * @param score - The score to validate
 * @param par - Par for the hole
 * @returns True if valid score
 */
export const isValidScore = (score: number, par: number): boolean => {
  // Score should be positive and reasonable (max triple par)
  return score > 0 && score <= par * 3;
};
