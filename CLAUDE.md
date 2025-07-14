# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JavaScript library implementing the ITU-T E-model for evaluating voice quality of the Opus audio codec. The project provides empirically-derived Ie (Equipment Impairment) and Bpl (Packet Loss Robustness) factors for three bandwidth configurations across VBR and CBR operating modes.

## Architecture

### Core Implementation
- **Main file**: `Opus_emodel.js` (292 lines) - Contains all functionality
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
├── LICENSE              # MIT License
├── README.md           # Minimal project description
└── Opus_emodel.js      # Complete implementation
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

### Quality Assessment Workflow
1. Choose bandwidth ("swb", "wb", "nb") based on codec configuration
2. Select operating mode ("vbr", "cbr") 
3. Specify packet loss pattern ("random", "bursty") or omit for Ie-only
4. Use returned coefficients in E-model R-factor calculation

## Development Considerations

### Code Standards
- MIT licensed open-source project
- ES6+ JavaScript with const declarations
- Extensive inline documentation explaining parameters and usage
- JSON data structures for empirical coefficient storage

### Telecommunications Context
This implements ITU-T E-model specifically calibrated for Opus codec performance evaluation. The Ie and Bpl factors are derived from empirical testing and represent codec-specific voice quality parameters for standardized telecommunications quality assessment.