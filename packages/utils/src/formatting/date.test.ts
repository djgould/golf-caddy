// @ts-nocheck
// TODO: Add proper Jest types
import { formatDate, getRelativeTime, formatDuration } from './date';

describe('Date Formatting Utils', () => {
  describe('formatDate', () => {
    const testDate = new Date('2024-03-15T14:30:00Z');

    it('should format date in short format', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toMatch(/Mar \d{1,2}, 2024/);
    });

    it('should format date in medium format', () => {
      expect(formatDate(testDate, 'medium')).toBe('Mar 15, 2024');
    });

    it('should format date in long format', () => {
      const result = formatDate(testDate, 'long');
      expect(result).toMatch(/Friday, March \d{1,2}, 2024/);
    });

    it('should format date in full format', () => {
      expect(formatDate(testDate, 'full')).toBe('Friday, March 15, 2024');
    });

    it('should format date with time', () => {
      expect(formatDate(testDate, 'datetime')).toMatch(/Mar 15, 2024 at/);
    });

    it('should format time only', () => {
      const result = formatDate(testDate, 'time');
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });

    it('should use short format by default', () => {
      const result = formatDate(testDate);
      expect(result).toMatch(/Mar \d{1,2}, 2024/);
    });

    it('should handle invalid dates', () => {
      const result = formatDate('invalid', 'short');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('getRelativeTime', () => {
    it('should return "just now" for current time', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('just now');
    });

    it('should return minutes ago', () => {
      const now = Date.now();
      const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);
      expect(getRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should return hours ago', () => {
      const now = Date.now();
      const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);
      expect(getRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should return "yesterday" for 1 day ago', () => {
      const now = Date.now();
      const yesterday = new Date(now - 24 * 60 * 60 * 1000);
      expect(getRelativeTime(yesterday)).toBe('yesterday');
    });

    it('should return days ago', () => {
      const now = Date.now();
      const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('should return "in X minutes" for future time', () => {
      const now = Date.now();
      const inTenMinutes = new Date(now + 10 * 60 * 1000 + 5000); // Add 5s buffer
      expect(getRelativeTime(inTenMinutes)).toBe('in 10 minutes');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds without hours', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05');
    });

    it('should format hours, minutes and seconds', () => {
      expect(formatDuration(3665)).toBe('1:01:05');
    });

    it('should handle zero seconds', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('should pad seconds correctly', () => {
      expect(formatDuration(9)).toBe('0:09');
    });

    it('should handle exact hours', () => {
      expect(formatDuration(3600)).toBe('1:00:00');
    });
  });
});
