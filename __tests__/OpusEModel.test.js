const OpusEModel = require('../Opus_emodel.js');

const {
  getEffective,
  getEffectiveForBitrate,
  getSupportedBitrates,
  getAvailableConfigurations,
  BANDWIDTH_TYPES,
  OPERATING_MODES,
  PACKET_LOSS_TYPES,
  OpusEModelError
} = OpusEModel;

describe('OpusEModel', () => {
  describe('Constants', () => {
    test('should export correct bandwidth types', () => {
      expect(BANDWIDTH_TYPES).toEqual({
        SWB: 'swb',
        WB: 'wb',
        NB: 'nb'
      });
    });

    test('should export correct operating modes', () => {
      expect(OPERATING_MODES).toEqual({
        VBR: 'vbr',
        CBR: 'cbr'
      });
    });

    test('should export correct packet loss types', () => {
      expect(PACKET_LOSS_TYPES).toEqual({
        RANDOM: 'random',
        BURSTY: 'bursty'
      });
    });
  });

  describe('getEffective()', () => {
    describe('Valid inputs', () => {
      test('should return SWB VBR configurations without packet loss', () => {
        const result = getEffective('swb', 'vbr');
        
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(11);
        expect(result[0]).toEqual({
          bitrate: 14,
          ie: 38.06,
          bpl: 1
        });
        expect(result[result.length - 1]).toEqual({
          bitrate: 40,
          ie: 10.66596559,
          bpl: 1
        });
      });

      test('should return SWB VBR configurations with random packet loss', () => {
        const result = getEffective('swb', 'vbr', 'random');
        
        expect(result.length).toBe(11);
        expect(result[0]).toEqual({
          bitrate: 14,
          ie: 38.06,
          bpl: 16.51
        });
      });

      test('should return SWB VBR configurations with bursty packet loss', () => {
        const result = getEffective('swb', 'vbr', 'bursty');
        
        expect(result.length).toBe(11);
        expect(result[0]).toEqual({
          bitrate: 14,
          ie: 38.06,
          bpl: 9.13
        });
      });

      test('should return WB CBR configurations', () => {
        const result = getEffective('wb', 'cbr');
        
        expect(result.length).toBe(4);
        expect(result).toEqual([
          { bitrate: 12, ie: 29.76435108, bpl: 1 },
          { bitrate: 13, ie: 26.16108167, bpl: 1 },
          { bitrate: 14, ie: 20.77194577, bpl: 1 },
          { bitrate: 15, ie: 18.06274989, bpl: 1 }
        ]);
      });

      test('should return NB configurations', () => {
        const vbrResult = getEffective('nb', 'vbr');
        const cbrResult = getEffective('nb', 'cbr');
        
        expect(vbrResult.length).toBe(4);
        expect(cbrResult.length).toBe(6);
      });

      test('should handle case-insensitive inputs', () => {
        const upperCase = getEffective('SWB', 'VBR', 'RANDOM');
        const lowerCase = getEffective('swb', 'vbr', 'random');
        const mixedCase = getEffective('Swb', 'Vbr', 'Random');
        
        expect(upperCase).toEqual(lowerCase);
        expect(lowerCase).toEqual(mixedCase);
      });

      test('should return sorted results by bitrate', () => {
        const result = getEffective('swb', 'vbr');
        
        for (let i = 1; i < result.length; i++) {
          expect(result[i].bitrate).toBeGreaterThan(result[i - 1].bitrate);
        }
      });
    });

    describe('Input validation', () => {
      test('should throw error for missing bandwidth', () => {
        expect(() => getEffective()).toThrow(OpusEModelError);
        expect(() => getEffective()).toThrow('Bandwidth parameter is required');
      });

      test('should throw error for missing mode', () => {
        expect(() => getEffective('swb')).toThrow(OpusEModelError);
        expect(() => getEffective('swb')).toThrow('Mode parameter is required');
      });

      test('should throw error for invalid bandwidth', () => {
        expect(() => getEffective('invalid', 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective('invalid', 'vbr')).toThrow('Invalid bandwidth');
      });

      test('should throw error for invalid mode', () => {
        expect(() => getEffective('swb', 'invalid')).toThrow(OpusEModelError);
        expect(() => getEffective('swb', 'invalid')).toThrow('Invalid mode');
      });

      test('should throw error for invalid loss type', () => {
        expect(() => getEffective('swb', 'vbr', 'invalid')).toThrow(OpusEModelError);
        expect(() => getEffective('swb', 'vbr', 'invalid')).toThrow('Invalid loss type');
      });

      test('should throw error for non-string inputs', () => {
        expect(() => getEffective(123, 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective('swb', 123)).toThrow(OpusEModelError);
      });
    });
  });

  describe('getEffectiveForBitrate()', () => {
    test('should return specific bitrate configuration', () => {
      const result = getEffectiveForBitrate('swb', 'vbr', 25, 'random');
      
      expect(result).toEqual({
        bitrate: 25,
        ie: 20.20905481,
        bpl: 11.28
      });
    });

    test('should return null for unsupported bitrate', () => {
      const result = getEffectiveForBitrate('swb', 'vbr', 999);
      
      expect(result).toBeNull();
    });

    test('should handle string and number bitrates', () => {
      const stringResult = getEffectiveForBitrate('swb', 'vbr', '25');
      const numberResult = getEffectiveForBitrate('swb', 'vbr', 25);
      
      expect(stringResult).toEqual(numberResult);
    });

    test('should return configuration without packet loss', () => {
      const result = getEffectiveForBitrate('wb', 'cbr', 12);
      
      expect(result).toEqual({
        bitrate: 12,
        ie: 29.76435108,
        bpl: 1
      });
    });
  });

  describe('getSupportedBitrates()', () => {
    test('should return all SWB VBR bitrates', () => {
      const result = getSupportedBitrates('swb', 'vbr');
      
      expect(result).toEqual([14, 15, 16, 19, 22, 25, 28, 31, 34, 37, 40]);
    });

    test('should return all WB CBR bitrates', () => {
      const result = getSupportedBitrates('wb', 'cbr');
      
      expect(result).toEqual([12, 13, 14, 15]);
    });

    test('should return all NB CBR bitrates', () => {
      const result = getSupportedBitrates('nb', 'cbr');
      
      expect(result).toEqual([6, 7, 8, 9, 10, 11]);
    });

    test('should return sorted bitrates', () => {
      const result = getSupportedBitrates('swb', 'cbr');
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
      }
    });

    test('should validate inputs', () => {
      expect(() => getSupportedBitrates('invalid', 'vbr')).toThrow(OpusEModelError);
      expect(() => getSupportedBitrates('swb', 'invalid')).toThrow(OpusEModelError);
    });
  });

  describe('getAvailableConfigurations()', () => {
    test('should return all available configurations', () => {
      const result = getAvailableConfigurations();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(6); // 3 bandwidths × 2 modes
      
      const swbVbr = result.find(config => 
        config.bandwidth === 'swb' && config.mode === 'vbr'
      );
      expect(swbVbr).toBeDefined();
      expect(swbVbr.bitrates).toEqual([14, 15, 16, 19, 22, 25, 28, 31, 34, 37, 40]);
      
      const nbCbr = result.find(config => 
        config.bandwidth === 'nb' && config.mode === 'cbr'
      );
      expect(nbCbr).toBeDefined();
      expect(nbCbr.bitrates).toEqual([6, 7, 8, 9, 10, 11]);
    });

    test('should return sorted bitrates for each configuration', () => {
      const result = getAvailableConfigurations();
      
      result.forEach(config => {
        for (let i = 1; i < config.bitrates.length; i++) {
          expect(config.bitrates[i]).toBeGreaterThan(config.bitrates[i - 1]);
        }
      });
    });
  });

  describe('OpusEModelError', () => {
    test('should create error with message and code', () => {
      const error = new OpusEModelError('Test message', 'TEST_CODE');
      
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('OpusEModelError');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('Data integrity', () => {
    test('should have consistent data structure', () => {
      const allConfigs = getAvailableConfigurations();
      
      allConfigs.forEach(config => {
        const metrics = getEffective(config.bandwidth, config.mode);
        expect(metrics.length).toBe(config.bitrates.length);
        
        metrics.forEach(metric => {
          expect(typeof metric.bitrate).toBe('number');
          expect(typeof metric.ie).toBe('number');
          expect(typeof metric.bpl).toBe('number');
          expect(metric.ie).toBeGreaterThan(0);
          expect(metric.bpl).toBeGreaterThan(0);
        });
      });
    });

    test('should have all expected SWB configurations', () => {
      const swbVbrBitrates = getSupportedBitrates('swb', 'vbr');
      const swbCbrBitrates = getSupportedBitrates('swb', 'cbr');
      
      expect(swbVbrBitrates).toContain(14);
      expect(swbVbrBitrates).toContain(40);
      expect(swbCbrBitrates).toContain(16);
      expect(swbCbrBitrates).toContain(40);
      expect(swbCbrBitrates).not.toContain(14); // CBR doesn't have 14kbps
      expect(swbCbrBitrates).not.toContain(15); // CBR doesn't have 15kbps
    });
  });
});