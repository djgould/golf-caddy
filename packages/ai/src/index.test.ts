import { AIVersion } from './index';

describe('@repo/ai', () => {
  describe('AIVersion', () => {
    it('should export a version string', () => {
      expect(typeof AIVersion).toBe('string');
      expect(AIVersion).toBe('0.0.0');
    });

    it('should match the expected version format', () => {
      expect(AIVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('package exports', () => {
    it('should export AIVersion', () => {
      expect(AIVersion).toBeDefined();
    });
  });
});
