const OpusEModel = require('../Opus_emodel.js');

const {
  getEffective,
  getEffectiveForBitrate,
  getSupportedBitrates,
  OpusEModelError
} = OpusEModel;

describe('Input Validation and Error Handling', () => {
  describe('Parameter validation', () => {
    describe('Bandwidth validation', () => {
      test('should reject null bandwidth', () => {
        expect(() => getEffective(null, 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective(null, 'vbr')).toThrow('Bandwidth parameter is required');
      });

      test('should reject undefined bandwidth', () => {
        expect(() => getEffective(undefined, 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective(undefined, 'vbr')).toThrow('Bandwidth parameter is required');
      });

      test('should reject empty string bandwidth', () => {
        expect(() => getEffective('', 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective('', 'vbr')).toThrow('Bandwidth parameter is required');
      });

      test('should reject numeric bandwidth', () => {
        expect(() => getEffective(123, 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective(123, 'vbr')).toThrow('Bandwidth parameter is required');
      });

      test('should reject boolean bandwidth', () => {
        expect(() => getEffective(true, 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective(false, 'vbr')).toThrow(OpusEModelError);
      });

      test('should reject object bandwidth', () => {
        expect(() => getEffective({}, 'vbr')).toThrow(OpusEModelError);
        expect(() => getEffective([], 'vbr')).toThrow(OpusEModelError);
      });

      test('should reject invalid string bandwidth', () => {
        const invalidBandwidths = ['invalid', 'wide', 'narrow', 'super', 'SWB_VBR'];
        
        invalidBandwidths.forEach(bandwidth => {
          expect(() => getEffective(bandwidth, 'vbr')).toThrow(OpusEModelError);
          expect(() => getEffective(bandwidth, 'vbr')).toThrow('Invalid bandwidth');
        });
      });
    });

    describe('Mode validation', () => {
      test('should reject null mode', () => {
        expect(() => getEffective('swb', null)).toThrow(OpusEModelError);
        expect(() => getEffective('swb', null)).toThrow('Mode parameter is required');
      });

      test('should reject undefined mode', () => {
        expect(() => getEffective('swb', undefined)).toThrow(OpusEModelError);
        expect(() => getEffective('swb', undefined)).toThrow('Mode parameter is required');
      });

      test('should reject empty string mode', () => {
        expect(() => getEffective('swb', '')).toThrow(OpusEModelError);
        expect(() => getEffective('swb', '')).toThrow('Mode parameter is required');
      });

      test('should reject numeric mode', () => {
        expect(() => getEffective('swb', 123)).toThrow(OpusEModelError);
        expect(() => getEffective('swb', 123)).toThrow('Mode parameter is required');
      });

      test('should reject invalid string mode', () => {
        const invalidModes = ['invalid', 'variable', 'constant', 'VBR_MODE', 'hybrid'];
        
        invalidModes.forEach(mode => {
          expect(() => getEffective('swb', mode)).toThrow(OpusEModelError);
          expect(() => getEffective('swb', mode)).toThrow('Invalid mode');
        });
      });
    });

    describe('Loss type validation', () => {
      test('should accept undefined loss type', () => {
        expect(() => getEffective('swb', 'vbr', undefined)).not.toThrow();
        expect(() => getEffective('swb', 'vbr')).not.toThrow();
      });

      test('should accept null loss type', () => {
        expect(() => getEffective('swb', 'vbr', null)).not.toThrow();
      });

      test('should reject invalid loss type', () => {
        const invalidLossTypes = ['invalid', 'packet', 'loss', 'RANDOM_LOSS', 'burst'];
        
        invalidLossTypes.forEach(lossType => {
          expect(() => getEffective('swb', 'vbr', lossType)).toThrow(OpusEModelError);
          expect(() => getEffective('swb', 'vbr', lossType)).toThrow('Invalid loss type');
        });
      });

      test('should reject numeric loss type', () => {
        expect(() => getEffective('swb', 'vbr', 123)).toThrow(OpusEModelError);
        expect(() => getEffective('swb', 'vbr', 123)).toThrow('Loss type parameter must be a string');
      });
    });
  });

  describe('Error object properties', () => {
    test('should include error codes for debugging', () => {
      try {
        getEffective('invalid', 'vbr');
      } catch (error) {
        expect(error.code).toBe('UNSUPPORTED_BANDWIDTH');
        expect(error.name).toBe('OpusEModelError');
        expect(error instanceof OpusEModelError).toBe(true);
        expect(error instanceof Error).toBe(true);
      }
    });

    test('should include descriptive error messages', () => {
      try {
        getEffective('swb', 'invalid');
      } catch (error) {
        expect(error.message).toContain('Invalid mode');
        expect(error.message).toContain('invalid');
        expect(error.message).toContain('vbr, cbr');
      }
    });

    test('should list available options in error messages', () => {
      try {
        getEffective('invalid', 'vbr');
      } catch (error) {
        expect(error.message).toContain('swb, wb, nb');
      }

      try {
        getEffective('swb', 'vbr', 'invalid');
      } catch (error) {
        expect(error.message).toContain('random, bursty');
      }
    });
  });

  describe('Edge case validation', () => {
    test('should handle whitespace-only strings', () => {
      expect(() => getEffective('   ', 'vbr')).toThrow(OpusEModelError);
      expect(() => getEffective('swb', '   ')).toThrow(OpusEModelError);
      expect(() => getEffective('swb', 'vbr', '   ')).toThrow(OpusEModelError);
    });

    test('should handle strings with special characters', () => {
      const specialChars = ['swb!', 'sw@b', 'vbr#', 'v$br', 'rand%om'];
      
      specialChars.forEach(char => {
        expect(() => {
          if (char.includes('swb') || char.includes('sw')) {
            getEffective(char, 'vbr');
          } else if (char.includes('vbr') || char.includes('br')) {
            getEffective('swb', char);
          } else {
            getEffective('swb', 'vbr', char);
          }
        }).toThrow(OpusEModelError);
      });
    });

    test('should validate function-specific inputs', () => {
      // getEffectiveForBitrate specific validation
      expect(() => getEffectiveForBitrate('invalid', 'vbr', 25)).toThrow(OpusEModelError);
      expect(() => getEffectiveForBitrate('swb', 'invalid', 25)).toThrow(OpusEModelError);
      
      // getSupportedBitrates specific validation  
      expect(() => getSupportedBitrates('invalid', 'vbr')).toThrow(OpusEModelError);
      expect(() => getSupportedBitrates('swb', 'invalid')).toThrow(OpusEModelError);
    });
  });

  describe('Case sensitivity handling', () => {
    test('should normalize case for all valid inputs', () => {
      const testCases = [
        { bandwidth: 'SWB', mode: 'VBR', lossType: 'RANDOM' },
        { bandwidth: 'Swb', mode: 'Vbr', lossType: 'Random' },
        { bandwidth: 'swB', mode: 'vBr', lossType: 'ranDom' },
        { bandwidth: 'WB', mode: 'CBR', lossType: 'BURSTY' },
        { bandwidth: 'Wb', mode: 'Cbr', lossType: 'Bursty' },
        { bandwidth: 'NB', mode: 'VBR', lossType: undefined }
      ];
      
      testCases.forEach(({ bandwidth, mode, lossType }) => {
        expect(() => getEffective(bandwidth, mode, lossType)).not.toThrow();
        expect(() => getEffectiveForBitrate(bandwidth, mode, 25, lossType)).not.toThrow();
        expect(() => getSupportedBitrates(bandwidth, mode)).not.toThrow();
      });
    });

    test('should reject invalid inputs regardless of case', () => {
      const invalidCases = [
        { bandwidth: 'INVALID', mode: 'VBR' },
        { bandwidth: 'Invalid', mode: 'Vbr' },
        { bandwidth: 'SWB', mode: 'INVALID' },
        { bandwidth: 'swb', mode: 'Invalid' },
        { bandwidth: 'swb', mode: 'vbr', lossType: 'INVALID' },
        { bandwidth: 'swb', mode: 'vbr', lossType: 'Invalid' }
      ];
      
      invalidCases.forEach(({ bandwidth, mode, lossType }) => {
        expect(() => getEffective(bandwidth, mode, lossType)).toThrow(OpusEModelError);
      });
    });
  });

  describe('Configuration existence validation', () => {
    test('should validate that configuration exists for parameters', () => {
      // All valid combinations should not throw
      const validCombinations = [
        ['swb', 'vbr'], ['swb', 'cbr'],
        ['wb', 'vbr'], ['wb', 'cbr'],
        ['nb', 'vbr'], ['nb', 'cbr']
      ];
      
      validCombinations.forEach(([bandwidth, mode]) => {
        expect(() => getEffective(bandwidth, mode)).not.toThrow();
        expect(() => getSupportedBitrates(bandwidth, mode)).not.toThrow();
      });
    });
  });
});