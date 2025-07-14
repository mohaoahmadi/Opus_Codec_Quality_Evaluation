# Test Documentation

## Overview

This document provides comprehensive testing documentation for the Opus Codec Quality Evaluation library. The testing suite ensures reliability, performance, and correctness of the ITU-T E-model implementation.

## Test Structure

### Test Files

```
__tests__/
├── OpusEModel.test.js      # Core functionality and API tests
├── validation.test.js      # Input validation and error handling
├── integration.test.js     # Real-world usage scenarios
└── performance.test.js     # Performance and edge case tests
```

### Test Categories

#### 1. Unit Tests (`OpusEModel.test.js`)
Tests individual functions and their core functionality:

- **Constants validation**: Verifies exported constants match expected values
- **getEffective()**: Tests core function with all parameter combinations
- **getEffectiveForBitrate()**: Tests single bitrate lookup functionality
- **getSupportedBitrates()**: Tests bitrate enumeration
- **getAvailableConfigurations()**: Tests configuration discovery
- **Data integrity**: Verifies consistency across different access methods

#### 2. Validation Tests (`validation.test.js`)
Comprehensive input validation and error handling:

- **Parameter validation**: Tests null, undefined, invalid types
- **Error object properties**: Verifies error codes and messages
- **Edge case validation**: Tests whitespace, special characters
- **Case sensitivity**: Tests normalization of input parameters
- **Configuration existence**: Verifies valid parameter combinations

#### 3. Integration Tests (`integration.test.js`)
Real-world usage scenarios and workflows:

- **Telecommunications workflow**: E-model R-factor calculations
- **Codec comparison**: Quality analysis across configurations
- **Network planning**: Packet loss sensitivity analysis
- **Application integration**: Dynamic configuration selection
- **Error recovery**: Graceful handling of edge cases

#### 4. Performance Tests (`performance.test.js`)
Performance benchmarks and stress testing:

- **Execution speed**: Sub-millisecond response times
- **Memory efficiency**: No memory leaks with repeated calls
- **Concurrent access**: Multi-threaded usage patterns
- **Boundary conditions**: Extreme parameter combinations
- **Data precision**: Floating-point accuracy verification

## Test Configuration

### Jest Configuration
```javascript
{
  testEnvironment: 'node',
  collectCoverageFrom: ['Opus_emodel.js'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
```

### Coverage Requirements
- **Functions**: 90% minimum coverage
- **Lines**: 90% minimum coverage  
- **Branches**: 85% minimum coverage
- **Statements**: 90% minimum coverage

## Running Tests

### Basic Commands
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode for development
npm run test:watch

# Run verbose output
npm run test:verbose

# Run for CI/CD pipelines
npm run test:ci
```

### Alternative Test Runner
If npm installation fails, use the included basic test runner:
```bash
node test-runner.js
```

## Test Data and Scenarios

### Supported Configurations
The tests verify all supported bandwidth/mode combinations:

| Bandwidth | Mode | Bitrates (kbps) | Count |
|-----------|------|----------------|-------|
| SWB | VBR | 14,15,16,19,22,25,28,31,34,37,40 | 11 |
| SWB | CBR | 16,19,22,25,28,31,34,37,40 | 9 |
| WB | VBR | 11,12,13 | 3 |
| WB | CBR | 12,13,14,15 | 4 |
| NB | VBR | 6,7,8,9 | 4 |
| NB | CBR | 6,7,8,9,10,11 | 6 |

### Packet Loss Types
- **Random**: Statistical packet loss patterns
- **Bursty**: Correlated packet loss patterns  
- **None**: Ie-only calculations (Bpl = 1)

### Performance Benchmarks
- **Single call latency**: < 1ms average
- **Bitrate lookup**: < 0.5ms average
- **Concurrent access**: 100 calls < 100ms
- **Memory usage**: < 1MB increase after 10k operations

## Error Testing

### Error Codes Tested
- `INVALID_BANDWIDTH`: Missing or invalid bandwidth parameter
- `INVALID_MODE`: Missing or invalid mode parameter
- `UNSUPPORTED_BANDWIDTH`: Unrecognized bandwidth value
- `UNSUPPORTED_MODE`: Unrecognized mode value
- `UNSUPPORTED_LOSS_TYPE`: Invalid packet loss type
- `CONFIGURATION_NOT_FOUND`: No data for parameter combination

### Invalid Input Categories
- **Type errors**: Numbers, booleans, objects instead of strings
- **Null/undefined**: Missing required parameters
- **Empty strings**: Whitespace-only inputs
- **Invalid values**: Unrecognized bandwidth/mode/loss combinations
- **Unicode**: Special characters and diacritics

## Quality Assurance

### Data Validation
Tests verify:
- All Ie values are positive numbers < 100
- All Bpl values are positive numbers < 50  
- Bitrates are positive integers
- Results are consistently sorted by bitrate
- Floating-point precision is maintained

### API Consistency
Tests ensure:
- Same data accessible through different methods
- Immutable return values (no shared object references)
- Case-insensitive parameter handling
- Deterministic results across multiple calls

### Real-world Scenarios
Integration tests cover:
- E-model R-factor calculation workflows
- Codec quality comparison analysis
- Network planning with packet loss considerations
- Dynamic configuration selection based on constraints
- Batch processing of multiple configurations

## Continuous Integration

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: npm run test:ci
  
- name: Upload Coverage
  uses: codecov/codecov-action@v1
  with:
    file: ./coverage/lcov.info
```

### Pre-commit Hooks
Recommended pre-commit hook:
```bash
#!/bin/sh
npm run test && npm run lint
```

## Debugging Tests

### Common Issues
1. **npm cache corruption**: Run `npm cache clean --force`
2. **Permission errors**: Check file permissions for test files
3. **Module loading**: Verify Node.js can resolve `./Opus_emodel.js`
4. **Jest not found**: Use alternative test runner if npm install fails

### Debug Commands
```bash
# Run specific test file
npm test OpusEModel.test.js

# Run with debug output
DEBUG=* npm test

# Run single test case
npm test -- --testNamePattern="should return SWB VBR"
```

## Best Practices

### Writing New Tests
1. Use descriptive test names that explain expected behavior
2. Group related tests using `describe()` blocks
3. Test both positive and negative cases
4. Include edge cases and boundary conditions
5. Verify error messages and codes for invalid inputs
6. Use appropriate matchers (`toBe`, `toEqual`, `toThrow`)

### Maintaining Tests
1. Update tests when adding new features
2. Remove tests for deprecated functionality
3. Keep test data synchronized with implementation
4. Review test coverage reports regularly
5. Refactor duplicate test code into helper functions

## Performance Monitoring

### Benchmarks to Track
- Function execution time trends
- Memory usage patterns
- Test suite execution time
- Coverage percentage over time

### Performance Alerts
Set up monitoring for:
- Test execution time > 10 seconds
- Memory usage increase > 10MB
- Coverage drops below thresholds
- New performance regressions

This comprehensive testing suite ensures the Opus E-Model implementation is reliable, performant, and suitable for production telecommunications applications.