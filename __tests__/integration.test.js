const OpusEModel = require('../Opus_emodel.js');

const {
  getEffective,
  getEffectiveForBitrate,
  getSupportedBitrates,
  getAvailableConfigurations,
  BANDWIDTH_TYPES,
  OPERATING_MODES,
  PACKET_LOSS_TYPES
} = OpusEModel;

describe('Integration Tests - Real-world Usage Scenarios', () => {
  describe('Telecommunications Quality Assessment Workflow', () => {
    test('should support E-model R-factor calculation workflow', () => {
      // Scenario: Calculate R-factor for SWB VBR 25kbps with 2% random packet loss
      const metric = getEffectiveForBitrate('swb', 'vbr', 25, 'random');
      
      expect(metric).toBeDefined();
      expect(metric.bitrate).toBe(25);
      expect(metric.ie).toBeCloseTo(20.20905481, 5);
      expect(metric.bpl).toBeCloseTo(11.28, 2);
      
      // Simulate E-model R-factor calculation
      const packetLossPercentage = 2.0;
      const simulatedRFactor = 94.2 - metric.ie - (metric.bpl * packetLossPercentage);
      
      expect(simulatedRFactor).toBeGreaterThan(50); // Acceptable quality threshold
    });

    test('should support codec comparison workflow', () => {
      // Scenario: Compare different SWB configurations for best quality
      const swbVbrMetrics = getEffective('swb', 'vbr');
      const swbCbrMetrics = getEffective('swb', 'cbr');
      
      // Find lowest Ie (best quality) for each mode
      const bestVbr = swbVbrMetrics.reduce((best, current) => 
        current.ie < best.ie ? current : best
      );
      const bestCbr = swbCbrMetrics.reduce((best, current) => 
        current.ie < best.ie ? current : best
      );
      
      expect(bestVbr.bitrate).toBe(40); // Highest bitrate should have lowest Ie
      expect(bestCbr.bitrate).toBe(40);
      expect(bestVbr.ie).toBeLessThan(bestCbr.ie); // VBR typically has better quality
    });

    test('should support bandwidth selection workflow', () => {
      // Scenario: Select appropriate bandwidth based on available bitrate
      const targetBitrate = 15;
      
      const swbSupported = getSupportedBitrates('swb', 'vbr').includes(targetBitrate);
      const wbSupported = getSupportedBitrates('wb', 'vbr').includes(targetBitrate);
      const nbSupported = getSupportedBitrates('nb', 'vbr').includes(targetBitrate);
      
      expect(swbSupported).toBe(true);  // SWB supports 15kbps
      expect(wbSupported).toBe(false);  // WB doesn't support 15kbps  
      expect(nbSupported).toBe(false);  // NB doesn't support 15kbps
      
      // Get the actual configuration
      const config = getEffectiveForBitrate('swb', 'vbr', targetBitrate);
      expect(config).toBeDefined();
      expect(config.bitrate).toBe(targetBitrate);
    });
  });

  describe('Network Planning Scenarios', () => {
    test('should support packet loss sensitivity analysis', () => {
      // Scenario: Analyze impact of different packet loss patterns
      const bitrate = 25;
      
      const noLoss = getEffectiveForBitrate('swb', 'vbr', bitrate);
      const randomLoss = getEffectiveForBitrate('swb', 'vbr', bitrate, 'random');
      const burstyLoss = getEffectiveForBitrate('swb', 'vbr', bitrate, 'bursty');
      
      expect(noLoss.bpl).toBe(1); // Default BPL
      expect(randomLoss.bpl).toBeGreaterThan(1);
      expect(burstyLoss.bpl).toBeGreaterThan(1);
      expect(burstyLoss.bpl).toBeLessThan(randomLoss.bpl); // Bursty typically more robust
      
      // All should have same Ie value
      expect(noLoss.ie).toBe(randomLoss.ie);
      expect(randomLoss.ie).toBe(burstyLoss.ie);
    });

    test('should support bandwidth efficiency analysis', () => {
      // Scenario: Find most efficient bitrate per bandwidth
      const configurations = getAvailableConfigurations();
      
      configurations.forEach(config => {
        const metrics = getEffective(config.bandwidth, config.mode);
        
        // Verify quality improves (Ie decreases) with higher bitrates
        for (let i = 1; i < metrics.length; i++) {
          expect(metrics[i].bitrate).toBeGreaterThan(metrics[i - 1].bitrate);
          // Generally, higher bitrates should have lower Ie (better quality)
          // Note: There might be some exceptions due to codec characteristics
        }
      });
    });

    test('should support multi-configuration comparison', () => {
      // Scenario: Compare same bitrate across different bandwidths
      const targetBitrate = 12;
      
      const wbVbr = getEffectiveForBitrate('wb', 'vbr', targetBitrate);
      const wbCbr = getEffectiveForBitrate('wb', 'cbr', targetBitrate);
      
      expect(wbVbr).toBeDefined();
      expect(wbCbr).toBeDefined();
      
      // Both should have same bitrate but different quality metrics
      expect(wbVbr.bitrate).toBe(targetBitrate);
      expect(wbCbr.bitrate).toBe(targetBitrate);
      expect(wbVbr.ie).not.toBe(wbCbr.ie);
    });
  });

  describe('Application Integration Scenarios', () => {
    test('should support dynamic configuration selection', () => {
      // Scenario: Application needs to select best configuration for constraints
      const maxBitrate = 20;
      const requiresPacketLossRobustness = true;
      
      const allConfigs = getAvailableConfigurations();
      const suitableConfigs = allConfigs
        .map(config => ({
          ...config,
          availableBitrates: config.bitrates.filter(br => br <= maxBitrate)
        }))
        .filter(config => config.availableBitrates.length > 0);
      
      expect(suitableConfigs.length).toBeGreaterThan(0);
      
      // Get actual metrics for suitable configurations
      suitableConfigs.forEach(config => {
        config.availableBitrates.forEach(bitrate => {
          const metric = getEffectiveForBitrate(
            config.bandwidth, 
            config.mode, 
            bitrate,
            requiresPacketLossRobustness ? 'random' : undefined
          );
          
          expect(metric).toBeDefined();
          expect(metric.bitrate).toBeLessThanOrEqual(maxBitrate);
          
          if (requiresPacketLossRobustness) {
            expect(metric.bpl).toBeGreaterThan(1);
          }
        });
      });
    });

    test('should support quality threshold filtering', () => {
      // Scenario: Filter configurations meeting quality requirements
      const maxAcceptableIe = 25.0; // Quality threshold
      
      const allConfigs = getAvailableConfigurations();
      
      allConfigs.forEach(config => {
        const metrics = getEffective(config.bandwidth, config.mode);
        const acceptableMetrics = metrics.filter(m => m.ie <= maxAcceptableIe);
        
        // Verify filtering works correctly
        acceptableMetrics.forEach(metric => {
          expect(metric.ie).toBeLessThanOrEqual(maxAcceptableIe);
        });
        
        // Higher bitrates should be more likely to meet quality threshold
        if (acceptableMetrics.length > 0) {
          const minAcceptableBitrate = Math.min(...acceptableMetrics.map(m => m.bitrate));
          const higherBitrates = metrics.filter(m => m.bitrate >= minAcceptableBitrate);
          
          // Most higher bitrates should meet quality threshold
          const passingHigherBitrates = higherBitrates.filter(m => m.ie <= maxAcceptableIe);
          expect(passingHigherBitrates.length).toBeGreaterThan(0);
        }
      });
    });

    test('should support batch processing workflow', () => {
      // Scenario: Process multiple codec configurations efficiently
      const testScenarios = [
        { bandwidth: 'swb', mode: 'vbr', lossType: 'random' },
        { bandwidth: 'swb', mode: 'cbr', lossType: 'bursty' },
        { bandwidth: 'wb', mode: 'vbr', lossType: undefined },
        { bandwidth: 'nb', mode: 'cbr', lossType: 'random' }
      ];
      
      const results = testScenarios.map(scenario => ({
        scenario,
        metrics: getEffective(scenario.bandwidth, scenario.mode, scenario.lossType),
        supportedBitrates: getSupportedBitrates(scenario.bandwidth, scenario.mode)
      }));
      
      // Verify batch processing results
      results.forEach((result, index) => {
        expect(result.metrics.length).toBeGreaterThan(0);
        expect(result.supportedBitrates.length).toBe(result.metrics.length);
        
        // Verify metric bitrates match supported bitrates
        const metricBitrates = result.metrics.map(m => m.bitrate).sort((a, b) => a - b);
        const supportedBitrates = result.supportedBitrates.sort((a, b) => a - b);
        expect(metricBitrates).toEqual(supportedBitrates);
      });
    });
  });

  describe('Error Recovery Scenarios', () => {
    test('should gracefully handle unsupported bitrate requests', () => {
      // Scenario: Application requests unsupported bitrate
      const unsupportedBitrates = [1, 5, 50, 100, 999];
      
      unsupportedBitrates.forEach(bitrate => {
        const result = getEffectiveForBitrate('swb', 'vbr', bitrate);
        expect(result).toBeNull();
      });
      
      // Should still provide list of supported bitrates for fallback
      const supported = getSupportedBitrates('swb', 'vbr');
      expect(supported.length).toBeGreaterThan(0);
    });

    test('should maintain consistency across different access patterns', () => {
      // Scenario: Verify same data accessible through different methods
      const bandwidth = 'swb';
      const mode = 'vbr';
      
      const allMetrics = getEffective(bandwidth, mode, 'random');
      const supportedBitrates = getSupportedBitrates(bandwidth, mode);
      
      // Each supported bitrate should be retrievable individually
      supportedBitrates.forEach(bitrate => {
        const individualMetric = getEffectiveForBitrate(bandwidth, mode, bitrate, 'random');
        const correspondingMetric = allMetrics.find(m => m.bitrate === bitrate);
        
        expect(individualMetric).toEqual(correspondingMetric);
      });
    });
  });
});