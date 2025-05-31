import { OfflineVersion } from './index';

describe('@repo/offline', () => {
  describe('OfflineVersion', () => {
    it('should export a version string', () => {
      expect(typeof OfflineVersion).toBe('string');
      expect(OfflineVersion).toBe('0.0.0');
    });

    it('should match the expected version format', () => {
      expect(OfflineVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('package exports', () => {
    it('should export OfflineVersion', () => {
      expect(OfflineVersion).toBeDefined();
    });
  });
});
