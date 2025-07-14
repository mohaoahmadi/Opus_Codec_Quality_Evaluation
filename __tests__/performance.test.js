const OpusEModel = require('../Opus_emodel.js');

const {
  getEffective,
  getEffectiveForBitrate,
  getSupportedBitrates,
  getAvailableConfigurations
} = OpusEModel;

describe('Performance and Edge Case Tests', () => {
  describe('Performance benchmarks', () => {
    test('should execute getEffective() within acceptable time limits', () => {
      const iterations = 1000;
      const startTime = process.hrtime.bigint();
      
      for (let i = 0; i < iterations; i++) {
        getEffective('swb', 'vbr', 'random');
      }
      
      const endTime = process.hrtime.bigint();
      const executionTimeMs = Number(endTime - startTime) / 1000000;
      const avgTimePerCall = executionTimeMs / iterations;
      
      // Should execute in less than 1ms per call on average
      expect(avgTimePerCall).toBeLessThan(1);
      console.log(`Average execution time per getEffective() call: ${avgTimePerCall.toFixed(4)}ms`);
    });

    test('should execute getEffectiveForBitrate() efficiently', () => {
      const iterations = 1000;
      const startTime = process.hrtime.bigint();
      
      for (let i = 0; i < iterations; i++) {
        getEffectiveForBitrate('swb', 'vbr', 25, 'random');
      }
      
      const endTime = process.hrtime.bigint();
      const executionTimeMs = Number(endTime - startTime) / 1000000;
      const avgTimePerCall = executionTimeMs / iterations;
      
      // Single bitrate lookup should be faster than full configuration retrieval
      expect(avgTimePerCall).toBeLessThan(0.5);
      console.log(`Average execution time per getEffectiveForBitrate() call: ${avgTimePerCall.toFixed(4)}ms`);
    });

    test('should handle concurrent access efficiently', async () => {
      const concurrentCalls = 100;
      const startTime = process.hrtime.bigint();
      
      const promises = Array(concurrentCalls).fill().map((_, i) => {
        return Promise.resolve().then(() => {
          const bandwidth = ['swb', 'wb', 'nb'][i % 3];
          const mode = ['vbr', 'cbr'][i % 2];
          const lossType = i % 3 === 0 ? 'random' : i % 3 === 1 ? 'bursty' : undefined;
          
          return getEffective(bandwidth, mode, lossType);
        });
      });
      
      const results = await Promise.all(promises);
      const endTime = process.hrtime.bigint();
      const totalTimeMs = Number(endTime - startTime) / 1000000;
      
      expect(results.length).toBe(concurrentCalls);
      expect(totalTimeMs).toBeLessThan(100); // Should complete within 100ms
      console.log(`Concurrent execution time for ${concurrentCalls} calls: ${totalTimeMs.toFixed(2)}ms`);
    });

    test('should maintain consistent performance across all configurations', () => {
      const allConfigs = getAvailableConfigurations();
      const timings = [];
      
      allConfigs.forEach(config => {
        const iterations = 100;
        const startTime = process.hrtime.bigint();
        
        for (let i = 0; i < iterations; i++) {
          getEffective(config.bandwidth, config.mode, 'random');
        }
        
        const endTime = process.hrtime.bigint();
        const avgTime = Number(endTime - startTime) / 1000000 / iterations;
        timings.push(avgTime);
      });
      
      const maxTiming = Math.max(...timings);
      const minTiming = Math.min(...timings);
      const variance = maxTiming - minTiming;
      
      // Performance should be consistent across configurations (variance < 200%)
      expect(variance / minTiming).toBeLessThan(2.0);
      console.log(`Performance variance across configurations: ${(variance / minTiming * 100).toFixed(2)}%`);
    });
  });

  describe('Memory usage and efficiency', () => {
    test('should not create memory leaks with repeated calls', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform many operations
      for (let i = 0; i < 10000; i++) {
        const config = getEffective('swb', 'vbr');
        const bitrate = getSupportedBitrates('wb', 'cbr');
        const specific = getEffectiveForBitrate('nb', 'vbr', 6);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
      console.log(`Memory increase after 10k operations: ${(memoryIncrease / 1024).toFixed(2)}KB`);
    });

    test('should return immutable results', () => {
      const result1 = getEffective('swb', 'vbr', 'random');
      const result2 = getEffective('swb', 'vbr', 'random');
      
      // Results should be equal but not the same object
      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2);
      
      // Modifying one result should not affect the other
      result1[0].ie = 999;
      expect(result2[0].ie).not.toBe(999);
    });
  });

  describe('Edge cases and boundary conditions', () => {
    test('should handle extreme parameter combinations', () => {
      // Test all valid combinations systematically
      const bandwidths = ['swb', 'wb', 'nb'];
      const modes = ['vbr', 'cbr'];
      const lossTypes = [undefined, 'random', 'bursty'];
      
      bandwidths.forEach(bandwidth => {
        modes.forEach(mode => {
          lossTypes.forEach(lossType => {
            expect(() => {
              const result = getEffective(bandwidth, mode, lossType);
              expect(Array.isArray(result)).toBe(true);
              expect(result.length).toBeGreaterThan(0);
            }).not.toThrow();
          });
        });
      });
    });

    test('should handle boundary bitrate values', () => {
      // Test minimum and maximum bitrates for each configuration
      const configs = getAvailableConfigurations();
      
      configs.forEach(config => {
        const minBitrate = Math.min(...config.bitrates);
        const maxBitrate = Math.max(...config.bitrates);
        
        // Test boundary values
        const minResult = getEffectiveForBitrate(config.bandwidth, config.mode, minBitrate);
        const maxResult = getEffectiveForBitrate(config.bandwidth, config.mode, maxBitrate);
        
        expect(minResult).toBeDefined();
        expect(maxResult).toBeDefined();
        expect(minResult.bitrate).toBe(minBitrate);
        expect(maxResult.bitrate).toBe(maxBitrate);
        
        // Test just outside boundaries
        const belowMin = getEffectiveForBitrate(config.bandwidth, config.mode, minBitrate - 1);
        const aboveMax = getEffectiveForBitrate(config.bandwidth, config.mode, maxBitrate + 1);
        
        expect(belowMin).toBeNull();
        expect(aboveMax).toBeNull();
      });
    });

    test('should handle numeric precision correctly', () => {
      // Test with various numeric formats for bitrates
      const testCases = [
        { input: 25, expected: 25 },
        { input: '25', expected: 25 },
        { input: 25.0, expected: 25 },
        { input: '25.0', expected: 25 }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const result = getEffectiveForBitrate('swb', 'vbr', input);
        if (result) {
          expect(result.bitrate).toBe(expected);
        }
      });
    });

    test('should maintain data precision in calculations', () => {
      // Verify that floating-point values are preserved correctly
      const result = getEffectiveForBitrate('swb', 'vbr', 16, 'random');
      
      expect(result.ie).toBeCloseTo(30.16302131, 8);
      expect(result.bpl).toBeCloseTo(11.83, 2);
      
      // Test that repeated calls return identical values
      const result2 = getEffectiveForBitrate('swb', 'vbr', 16, 'random');
      expect(result.ie).toBe(result2.ie);
      expect(result.bpl).toBe(result2.bpl);
    });

    test('should handle empty and malformed inputs gracefully', () => {
      // These should all throw appropriate errors, not crash
      const malformedInputs = [
        [null, null, null],
        [undefined, undefined, undefined],
        ['', '', ''],
        [0, 0, 0],
        [[], [], []],
        [{}, {}, {}],
        [true, false, true]
      ];
      
      malformedInputs.forEach(([bandwidth, mode, lossType]) => {
        expect(() => {
          getEffective(bandwidth, mode, lossType);
        }).toThrow();
      });
    });

    test('should handle Unicode and special characters in input', () => {
      const unicodeInputs = [
        'swb\u0000', // null character
        'swb\uFEFF', // zero-width no-break space
        'swb\u200B', // zero-width space
        'ṡwb',       // with diacritics
        'ｓｗｂ'       // full-width characters
      ];
      
      unicodeInputs.forEach(input => {
        expect(() => {
          getEffective(input, 'vbr');
        }).toThrow();
      });
    });
  });

  describe('Data consistency verification', () => {
    test('should maintain consistent sorting across all results', () => {
      const allConfigs = getAvailableConfigurations();
      
      allConfigs.forEach(config => {
        const metrics = getEffective(config.bandwidth, config.mode);
        const supportedBitrates = getSupportedBitrates(config.bandwidth, config.mode);
        
        // Both should be sorted in ascending order
        for (let i = 1; i < metrics.length; i++) {
          expect(metrics[i].bitrate).toBeGreaterThan(metrics[i - 1].bitrate);
        }
        
        for (let i = 1; i < supportedBitrates.length; i++) {
          expect(supportedBitrates[i]).toBeGreaterThan(supportedBitrates[i - 1]);
        }
      });
    });

    test('should maintain data integrity across different access methods', () => {
      // Test that the same data is accessible through different methods
      const bandwidth = 'nb';
      const mode = 'cbr';
      
      const fullMetrics = getEffective(bandwidth, mode, 'bursty');
      const supportedBitrates = getSupportedBitrates(bandwidth, mode);
      const availableConfigs = getAvailableConfigurations();
      
      const matchingConfig = availableConfigs.find(
        config => config.bandwidth === bandwidth && config.mode === mode
      );
      
      // All methods should report the same bitrates
      expect(fullMetrics.map(m => m.bitrate).sort()).toEqual(supportedBitrates.sort());
      expect(supportedBitrates.sort()).toEqual(matchingConfig.bitrates.sort());
      
      // Individual lookups should match full results
      supportedBitrates.forEach(bitrate => {
        const individual = getEffectiveForBitrate(bandwidth, mode, bitrate, 'bursty');
        const fromFull = fullMetrics.find(m => m.bitrate === bitrate);
        
        expect(individual).toEqual(fromFull);
      });
    });

    test('should have valid numeric ranges for all coefficients', () => {
      const allConfigs = getAvailableConfigurations();
      
      allConfigs.forEach(config => {
        const metrics = getEffective(config.bandwidth, config.mode, 'random');
        
        metrics.forEach(metric => {
          // Bitrates should be positive integers
          expect(metric.bitrate).toBeGreaterThan(0);
          expect(Number.isInteger(metric.bitrate)).toBe(true);
          
          // Ie values should be positive (quality impairment)
          expect(metric.ie).toBeGreaterThan(0);
          expect(metric.ie).toBeLessThan(100); // Reasonable upper bound
          
          // Bpl values should be positive
          expect(metric.bpl).toBeGreaterThan(0);
          expect(metric.bpl).toBeLessThan(50); // Reasonable upper bound
        });
      });
    });
  });
});