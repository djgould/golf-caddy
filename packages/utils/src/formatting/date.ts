// Date formatting utilities

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @param format - The format type ('short' | 'medium' | 'long' | 'full' | 'time' | 'datetime')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' | 'time' | 'datetime' = 'short'
): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    case 'medium':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'full':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    case 'datetime':
      const dateStr = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${dateStr} at ${timeStr}`;
    default:
      return d.toLocaleDateString();
  }
};

/**
 * Get relative time string (e.g., "2 hours ago" or "in 2 hours")
 * @param date - The date to compare
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(Math.abs(diffMs) / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const isFuture = diffMs < 0;
  const prefix = isFuture ? 'in ' : '';
  const suffix = isFuture ? '' : ' ago';

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${prefix}${diffMins} minute${diffMins === 1 ? '' : 's'}${suffix}`;
  } else if (diffHours < 24) {
    return `${prefix}${diffHours} hour${diffHours === 1 ? '' : 's'}${suffix}`;
  } else if (diffDays === 1) {
    return isFuture ? 'tomorrow' : 'yesterday';
  } else if (diffDays < 7) {
    return `${prefix}${diffDays} day${diffDays === 1 ? '' : 's'}${suffix}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${prefix}${weeks} week${weeks === 1 ? '' : 's'}${suffix}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${prefix}${months} month${months === 1 ? '' : 's'}${suffix}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${prefix}${years} year${years === 1 ? '' : 's'}${suffix}`;
  }
};

/**
 * Format duration in seconds to readable time format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1:23:45" or "2:05")
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};
