// Common test fixtures for Golf Caddy

export const userFixtures = {
  testUser: {
    id: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User',
    handicap: 15.2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  proUser: {
    id: 'test-user-2',
    email: 'pro@example.com',
    name: 'Pro Golfer',
    handicap: 2.1,
    isPro: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};

export const courseFixtures = {
  testCourse: {
    id: 'course-1',
    name: 'Test Golf Course',
    holes: 18,
    par: 72,
    rating: 71.5,
    slope: 125,
    address: '123 Golf Course Road',
    city: 'Golf City',
    state: 'GC',
    zip: '12345',
    phone: '555-0123',
  },
  shortCourse: {
    id: 'course-2',
    name: 'Executive Nine',
    holes: 9,
    par: 35,
    rating: 34.2,
    slope: 112,
    address: '456 Short Course Ave',
    city: 'Golf Town',
    state: 'GT',
    zip: '54321',
    phone: '555-9876',
  },
};

export const roundFixtures = {
  completeRound: {
    id: 'round-1',
    userId: userFixtures.testUser.id,
    courseId: courseFixtures.testCourse.id,
    date: new Date('2024-06-01'),
    totalScore: 87,
    holes: Array.from({ length: 18 }, (_, i) => ({
      holeNumber: i + 1,
      par: i % 3 === 0 ? 3 : i % 3 === 1 ? 4 : 5,
      score: i % 3 === 0 ? 3 : i % 3 === 1 ? 5 : 6,
      fairwayHit: i % 2 === 0,
      greenInRegulation: i % 3 === 0,
      putts: 2,
    })),
    weather: {
      temperature: 72,
      windSpeed: 8,
      conditions: 'partly_cloudy',
    },
  },
  partialRound: {
    id: 'round-2',
    userId: userFixtures.testUser.id,
    courseId: courseFixtures.shortCourse.id,
    date: new Date('2024-06-15'),
    totalScore: 41,
    holes: Array.from({ length: 9 }, (_, i) => ({
      holeNumber: i + 1,
      par: i % 2 === 0 ? 4 : 5,
      score: i % 2 === 0 ? 4 : 5,
      fairwayHit: true,
      greenInRegulation: i % 2 === 0,
      putts: 2,
    })),
  },
};

export const shotFixtures = {
  driveShot: {
    id: 'shot-1',
    roundId: roundFixtures.completeRound.id,
    holeNumber: 1,
    shotNumber: 1,
    club: 'driver',
    distance: 245,
    result: 'fairway',
    location: {
      lat: 40.7128,
      lng: -74.006,
    },
  },
  approachShot: {
    id: 'shot-2',
    roundId: roundFixtures.completeRound.id,
    holeNumber: 1,
    shotNumber: 2,
    club: '7_iron',
    distance: 152,
    result: 'green',
    location: {
      lat: 40.713,
      lng: -74.0058,
    },
  },
  puttShot: {
    id: 'shot-3',
    roundId: roundFixtures.completeRound.id,
    holeNumber: 1,
    shotNumber: 3,
    club: 'putter',
    distance: 15,
    result: 'hole',
    location: {
      lat: 40.7131,
      lng: -74.0057,
    },
  },
};

// Helper to create test data with overrides
export function createTestUser(overrides?: Partial<typeof userFixtures.testUser>) {
  return {
    ...userFixtures.testUser,
    ...overrides,
  };
}

export function createTestCourse(overrides?: Partial<typeof courseFixtures.testCourse>) {
  return {
    ...courseFixtures.testCourse,
    ...overrides,
  };
}

export function createTestRound(overrides?: Partial<typeof roundFixtures.completeRound>) {
  return {
    ...roundFixtures.completeRound,
    ...overrides,
  };
}
