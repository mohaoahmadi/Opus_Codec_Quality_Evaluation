/*
MIT License

Copyright (c) 2021 Mohannad Alahmadi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function(global) {
    'use strict';

    const BANDWIDTH_TYPES = {
        SWB: 'swb',
        WB: 'wb', 
        NB: 'nb'
    };

    const OPERATING_MODES = {
        VBR: 'vbr',
        CBR: 'cbr'
    };

    const PACKET_LOSS_TYPES = {
        RANDOM: 'random',
        BURSTY: 'bursty'
    };

    const DEFAULT_BPL_VALUE = 1;

    const CODEC_CONFIGURATIONS = {
        [BANDWIDTH_TYPES.SWB]: {
            [OPERATING_MODES.VBR]: {
                14: { ie: 38.06, bplrandom: 16.51, bplbursty: 9.13 },
                15: { ie: 34.12, bplrandom: 15, bplbursty: 7.9 },
                16: { ie: 30.16302131, bplrandom: 11.83, bplbursty: 10.06 },
                19: { ie: 23.80720462, bplrandom: 10.67, bplbursty: 8.92 },
                22: { ie: 20.22332357, bplrandom: 10.47, bplbursty: 8.57 },
                25: { ie: 20.20905481, bplrandom: 11.28, bplbursty: 9.18 },
                28: { ie: 18.47734739, bplrandom: 10.63, bplbursty: 8.91 },
                31: { ie: 16.82867498, bplrandom: 10.44, bplbursty: 8.82 },
                34: { ie: 14.75893036, bplrandom: 10.12, bplbursty: 8.54 },
                37: { ie: 12.07782849, bplrandom: 10.38, bplbursty: 8.30 },
                40: { ie: 10.66596559, bplrandom: 9.79, bplbursty: 8.04 }
            },
            [OPERATING_MODES.CBR]: {
                16: { ie: 36.88067115, bplrandom: 13.30, bplbursty: 10.80 },
                19: { ie: 29.58016175, bplrandom: 10.74, bplbursty: 8.93 },
                22: { ie: 23.38003477, bplrandom: 10.01, bplbursty: 8.46 },
                25: { ie: 22.64371205, bplrandom: 10.57, bplbursty: 8.74 },
                28: { ie: 23.65242842, bplrandom: 11.67, bplbursty: 9.98 },
                31: { ie: 21.74245539, bplrandom: 11.51, bplbursty: 9.58 },
                34: { ie: 20.62029481, bplrandom: 11.78, bplbursty: 9.69 },
                37: { ie: 16.22868955, bplrandom: 10.62, bplbursty: 8.99 },
                40: { ie: 15.89845959, bplrandom: 11.35, bplbursty: 9.37 }
            }
        },
        [BANDWIDTH_TYPES.WB]: {
            [OPERATING_MODES.VBR]: {
                11: { ie: 28.41322299, bplrandom: 23.93979569, bplbursty: 20.11987374 },
                12: { ie: 23.29505705, bplrandom: 22.2151863, bplbursty: 18.90376092 },
                13: { ie: 19.958882, bplrandom: 19.49608704, bplbursty: 16.91955649 }
            },
            [OPERATING_MODES.CBR]: {
                12: { ie: 29.76435108, bplrandom: 24.80947978, bplbursty: 20.77703993 },
                13: { ie: 26.16108167, bplrandom: 23.0047189, bplbursty: 19.372252 },
                14: { ie: 20.77194577, bplrandom: 17.5623101, bplbursty: 15.84824707 },
                15: { ie: 18.06274989, bplrandom: 18.73740804, bplbursty: 16.09740659 }
            }
        },
        [BANDWIDTH_TYPES.NB]: {
            [OPERATING_MODES.VBR]: {
                6: { ie: 23.00233478, bplrandom: 24.5644848, bplbursty: 15.35503534 },
                7: { ie: 21.25545861, bplrandom: 22.45885046, bplbursty: 14.42549516 },
                8: { ie: 16.02443357, bplrandom: 20.25866692, bplbursty: 13.47963008 },
                9: { ie: 11.73674352, bplrandom: 18.90829837, bplbursty: 12.44222463 }
            },
            [OPERATING_MODES.CBR]: {
                6: { ie: 46.26834316, bplrandom: 8.939710714, bplbursty: 5.655040056 },
                7: { ie: 31.73480382, bplrandom: 18.17914283, bplbursty: 11.76446295 },
                8: { ie: 19.24547807, bplrandom: 15.12823436, bplbursty: 10.1315844 },
                9: { ie: 13.20879771, bplrandom: 17.23921027, bplbursty: 11.36427122 },
                10: { ie: 6.197366255, bplrandom: 15.32972957, bplbursty: 10.47043983 },
                11: { ie: 2.030115291, bplrandom: 15.95164784, bplbursty: 10.73313709 }
            }
        }
    };

    class OpusEModelError extends Error {
        constructor(message, code) {
            super(message);
            this.name = 'OpusEModelError';
            this.code = code;
        }
    }

    function validateParameters(bandwidth, mode, lossType) {
        if (!bandwidth || typeof bandwidth !== 'string') {
            throw new OpusEModelError('Bandwidth parameter is required and must be a string', 'INVALID_BANDWIDTH');
        }
        
        if (!mode || typeof mode !== 'string') {
            throw new OpusEModelError('Mode parameter is required and must be a string', 'INVALID_MODE');
        }

        const normalizedBandwidth = bandwidth.toLowerCase();
        const normalizedMode = mode.toLowerCase();
        const normalizedLossType = lossType && typeof lossType === 'string' ? lossType.toLowerCase() : undefined;

        if (lossType && typeof lossType !== 'string') {
            throw new OpusEModelError('Loss type parameter must be a string', 'INVALID_LOSS_TYPE');
        }

        if (!Object.values(BANDWIDTH_TYPES).includes(normalizedBandwidth)) {
            throw new OpusEModelError(
                `Invalid bandwidth: ${bandwidth}. Must be one of: ${Object.values(BANDWIDTH_TYPES).join(', ')}`,
                'UNSUPPORTED_BANDWIDTH'
            );
        }

        if (!Object.values(OPERATING_MODES).includes(normalizedMode)) {
            throw new OpusEModelError(
                `Invalid mode: ${mode}. Must be one of: ${Object.values(OPERATING_MODES).join(', ')}`,
                'UNSUPPORTED_MODE'
            );
        }

        if (normalizedLossType && !Object.values(PACKET_LOSS_TYPES).includes(normalizedLossType)) {
            throw new OpusEModelError(
                `Invalid loss type: ${lossType}. Must be one of: ${Object.values(PACKET_LOSS_TYPES).join(', ')} or undefined`,
                'UNSUPPORTED_LOSS_TYPE'
            );
        }

        const configExists = CODEC_CONFIGURATIONS[normalizedBandwidth] && 
                           CODEC_CONFIGURATIONS[normalizedBandwidth][normalizedMode];
        
        if (!configExists) {
            throw new OpusEModelError(
                `No configuration found for bandwidth: ${bandwidth}, mode: ${mode}`,
                'CONFIGURATION_NOT_FOUND'
            );
        }

        return { normalizedBandwidth, normalizedMode, normalizedLossType };
    }

    function createQualityMetric(bitrate, config, lossType) {
        const result = {
            bitrate: parseInt(bitrate),
            ie: config.ie
        };

        if (lossType) {
            const bplKey = `bpl${lossType}`;
            result.bpl = config[bplKey];
        } else {
            result.bpl = DEFAULT_BPL_VALUE;
        }

        return result;
    }

    /**
     * Calculates Opus codec quality metrics using the ITU-T E-model
     * 
     * @param {string} bandwidth - Codec bandwidth ('swb', 'wb', 'nb')
     * @param {string} mode - Operating mode ('vbr', 'cbr') 
     * @param {string} [lossType] - Packet loss pattern ('random', 'bursty') or undefined for Ie-only
     * @returns {Array<{bitrate: number, ie: number, bpl: number}>} Quality metrics for all supported bitrates
     * @throws {OpusEModelError} When parameters are invalid or configuration not found
     * 
     * @example
     * // Get all SWB VBR configurations with random packet loss
     * const metrics = getEffective('swb', 'vbr', 'random');
     * 
     * @example  
     * // Get WB CBR configurations without packet loss (Ie-only)
     * const metrics = getEffective('wb', 'cbr');
     */
    function getEffective(bandwidth, mode, lossType) {
        const { normalizedBandwidth, normalizedMode, normalizedLossType } = 
            validateParameters(bandwidth, mode, lossType);

        const configuration = CODEC_CONFIGURATIONS[normalizedBandwidth][normalizedMode];
        
        return Object.entries(configuration)
            .map(([bitrate, config]) => createQualityMetric(bitrate, config, normalizedLossType))
            .sort((a, b) => a.bitrate - b.bitrate);
    }

    /**
     * Gets quality metrics for a specific bitrate configuration
     * 
     * @param {string} bandwidth - Codec bandwidth ('swb', 'wb', 'nb')
     * @param {string} mode - Operating mode ('vbr', 'cbr')
     * @param {number|string} bitrate - Target bitrate in kbps
     * @param {string} [lossType] - Packet loss pattern ('random', 'bursty') or undefined
     * @returns {{bitrate: number, ie: number, bpl: number}|null} Quality metric or null if not found
     * @throws {OpusEModelError} When parameters are invalid
     * 
     * @example
     * // Get specific SWB VBR 25kbps configuration
     * const metric = getEffectiveForBitrate('swb', 'vbr', 25, 'random');
     */
    function getEffectiveForBitrate(bandwidth, mode, bitrate, lossType) {
        const { normalizedBandwidth, normalizedMode, normalizedLossType } = 
            validateParameters(bandwidth, mode, lossType);

        const bitrateKey = String(bitrate);
        const configuration = CODEC_CONFIGURATIONS[normalizedBandwidth][normalizedMode];
        const config = configuration[bitrateKey];
        
        return config ? createQualityMetric(bitrateKey, config, normalizedLossType) : null;
    }

    /**
     * Gets all supported bitrates for a bandwidth and mode combination
     * 
     * @param {string} bandwidth - Codec bandwidth ('swb', 'wb', 'nb') 
     * @param {string} mode - Operating mode ('vbr', 'cbr')
     * @returns {number[]} Array of supported bitrates in kbps
     * @throws {OpusEModelError} When parameters are invalid
     */
    function getSupportedBitrates(bandwidth, mode) {
        const { normalizedBandwidth, normalizedMode } = validateParameters(bandwidth, mode);
        
        const configuration = CODEC_CONFIGURATIONS[normalizedBandwidth][normalizedMode];
        return Object.keys(configuration).map(Number).sort((a, b) => a - b);
    }

    /**
     * Gets all available bandwidth and mode combinations
     * 
     * @returns {Array<{bandwidth: string, mode: string, bitrates: number[]}>} Available configurations
     */
    function getAvailableConfigurations() {
        const configurations = [];
        
        Object.entries(CODEC_CONFIGURATIONS).forEach(([bandwidth, modes]) => {
            Object.entries(modes).forEach(([mode, configs]) => {
                configurations.push({
                    bandwidth,
                    mode,
                    bitrates: Object.keys(configs).map(Number).sort((a, b) => a - b)
                });
            });
        });
        
        return configurations;
    }

    const OpusEModel = {
        getEffective,
        getEffectiveForBitrate,
        getSupportedBitrates,
        getAvailableConfigurations,
        BANDWIDTH_TYPES,
        OPERATING_MODES,
        PACKET_LOSS_TYPES,
        OpusEModelError
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = OpusEModel;
    } else if (typeof window !== 'undefined') {
        window.getEffective = getEffective;
        window.OpusEModel = OpusEModel;
    } else {
        global.OpusEModel = OpusEModel;
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);