# Opus Codec Quality Evaluation

This is a JavaScript library implementing the ITU-T E-model for evaluating voice quality of the Opus audio codec. The project provides empirically-derived Ie (Equipment Impairment) and Bpl (Packet Loss Robustness) factors for three bandwidth configurations across VBR and CBR operating modes.

## Architecture

### Core Implementation
- **Main file**: `Opus_emodel.js` (284 lines) - Contains all functionality
- **Global function**: `window.getEffective(bandwidth, mode, lossType)` - Main API entry point
- **Data structures**: JSON-formatted coefficient arrays for each codec configuration

### Supported Configurations
- **SWB (Super Wideband)**: 11 VBR bitrates (14-40 kbps), 9 CBR bitrates (16-40 kbps)
- **WB (Wideband)**: 3 VBR bitrates (11-13 kbps), 4 CBR bitrates (12-15 kbps)  
- **NB (Narrowband)**: 4 VBR bitrates (6-9 kbps), 6 CBR bitrates (6-11 kbps)

### Function Parameters
- `bandwidth`: "swb", "wb", or "nb"
- `mode`: "vbr" or "cbr" 
- `lossType`: "random", "bursty", or undefined (for Ie-only calculation)

### Return Format
Returns array of objects: `{bitrate: "X", ie: Y.YY, bpl: Z.ZZ}`

## Development Environment

### Testing Infrastructure
Professional Jest-based testing suite with 91.8% statement coverage:

```bash
npm test              # Run all tests (81 tests pass)
npm run test:coverage # Run with coverage report  
npm run test:watch    # Development watch mode
npm run test:ci       # CI/CD pipeline mode
```

### Test Categories
- **Unit tests**: Core API functionality and data integrity
- **Validation tests**: Input sanitization and error handling  
- **Integration tests**: Real-world telecommunications workflows
- **Performance tests**: Sub-millisecond benchmarks and stress testing

### File Structure
```
/
├── LICENSE                     # MIT License
├── README.md                   # Project documentation
├── Opus_emodel.js             # Complete implementation
├── package.json               # Dependencies and scripts
├── jest.config.js             # Test configuration
├── __tests__/                 # Test suite
│   ├── OpusEModel.test.js     # Core functionality tests
│   ├── validation.test.js     # Input validation tests
│   ├── integration.test.js    # Real-world scenario tests
│   └── performance.test.js    # Performance and edge case tests
└── TEST_DOCUMENTATION.md      # Comprehensive testing guide
```

## Usage Notes

### Browser Integration
```javascript
// Include in HTML
<script src="Opus_emodel.js"></script>

// Call function
const results = getEffective("swb", "vbr", "random");
// Returns array with ie/bpl factors for all SWB VBR bitrates
```

### Node.js Integration
```javascript
const OpusEModel = require('./Opus_emodel.js');

// Get all configurations for SWB VBR with random packet loss
const metrics = OpusEModel.getEffective('swb', 'vbr', 'random');

// Get specific bitrate configuration
const metric = OpusEModel.getEffectiveForBitrate('swb', 'vbr', 25, 'random');

// Get supported bitrates
const bitrates = OpusEModel.getSupportedBitrates('wb', 'cbr');

// Get all available configurations
const configs = OpusEModel.getAvailableConfigurations();
```

### Quality Assessment Workflow
1. Choose bandwidth ("swb", "wb", "nb") based on codec configuration
2. Select operating mode ("vbr", "cbr") 
3. Specify packet loss pattern ("random", "bursty") or omit for Ie-only
4. Use returned coefficients in E-model R-factor calculation

## API Reference

### `getEffective(bandwidth, mode, lossType)`
Returns quality metrics for all supported bitrates in a configuration.

**Parameters:**
- `bandwidth` (string): "swb", "wb", or "nb"
- `mode` (string): "vbr" or "cbr"
- `lossType` (string, optional): "random", "bursty", or undefined

**Returns:** Array of `{bitrate: number, ie: number, bpl: number}` objects

### `getEffectiveForBitrate(bandwidth, mode, bitrate, lossType)`
Returns quality metrics for a specific bitrate configuration.

**Parameters:**
- `bandwidth` (string): "swb", "wb", or "nb"
- `mode` (string): "vbr" or "cbr"
- `bitrate` (number|string): Target bitrate in kbps
- `lossType` (string, optional): "random", "bursty", or undefined

**Returns:** `{bitrate: number, ie: number, bpl: number}` object or `null`

### `getSupportedBitrates(bandwidth, mode)`
Returns all supported bitrates for a bandwidth/mode combination.

**Parameters:**
- `bandwidth` (string): "swb", "wb", or "nb"
- `mode` (string): "vbr" or "cbr"

**Returns:** Array of numbers (bitrates in kbps)

### `getAvailableConfigurations()`
Returns all available bandwidth/mode combinations with their supported bitrates.

**Returns:** Array of `{bandwidth: string, mode: string, bitrates: number[]}` objects

## Error Handling

The library provides comprehensive error handling with descriptive error messages:

```javascript
try {
  const result = OpusEModel.getEffective('invalid', 'vbr');
} catch (error) {
  console.log(error.name);    // 'OpusEModelError'
  console.log(error.code);    // 'UNSUPPORTED_BANDWIDTH'
  console.log(error.message); // 'Invalid bandwidth: invalid. Must be one of: swb, wb, nb'
}
```

## Development Considerations

### Code Standards
- MIT licensed open-source project
- ES6+ JavaScript with modern syntax
- Comprehensive TypeScript-style JSDoc documentation
- Professional error handling with custom error types
- Universal module export pattern (Node.js, browser, global)

### Performance
- Sub-millisecond response times (average 0.004ms per call)
- O(1) lookup complexity with flattened data structures
- Memory efficient with no leaks
- Concurrent access support

### Telecommunications Context
This implements ITU-T E-model specifically calibrated for Opus codec performance evaluation. The Ie and Bpl factors are derived from empirical testing and represent codec-specific voice quality parameters for standardized telecommunications quality assessment.

## Installation

### npm (Recommended)
```bash
npm install opus-codec-quality-evaluation
```

### Direct Download
Download `Opus_emodel.js` and include it in your project.

## Testing

Run the comprehensive test suite:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Citation

If you use this library in your research or applications, please cite:

```
Alahmadi, M., Pocta, P., & Melvin, H. (2021). An Adaptive Bitrate Switching Algorithm for Speech Applications in Context of WebRTC. ACM Transactions on Multimedia Computing, Communications, and Applications, 17(4), Article 133. https://doi.org/10.1145/3458751
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass with `npm test`
5. Submit a pull request

## Support

For issues and questions:
- Create an issue on GitHub
- Review the [TEST_DOCUMENTATION.md](TEST_DOCUMENTATION.md) for detailed usage examples