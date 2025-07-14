module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'Opus_emodel.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov', 
    'html',
    'json'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};