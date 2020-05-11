// Jest configuration
const { defaults } = require('jest-config');
// https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
  // Modules can be explicitly auto-mocked using jest.mock(moduleName).
  // https://facebook.github.io/jest/docs/en/configuration.html#automock-boolean
  automock: false, // [boolean]

  // Respect Browserify's "browser" field in package.json when resolving modules.
  // https://facebook.github.io/jest/docs/en/configuration.html#browser-boolean
  browser: false, // [boolean]

  // This config option can be used here to have Jest stop running tests after the first failure.
  // https://facebook.github.io/jest/docs/en/configuration.html#bail-boolean
  bail: false, // [boolean]

  collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**'],

  // https://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
  coverageDirectory: '<rootDir>/coverage', // [string]
  globals: {
    __DEV__: true,
  },

  // https://facebook.github.io/jest/docs/en/configuration.html#mapcoverage-boolean
  // mapCoverage: false, // [boolean]

  // The default extensions Jest will look for.
  // https://facebook.github.io/jest/docs/en/configuration.html#modulefileextensions-array-string
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'json', 'jsx', 'node'],

  moduleDirectories: ['node_modules', 'src'],

  // A map from regular expressions to module names that allow to stub out resources,
  // like images or styles with a single module.
  moduleNameMapper: {
    '\\.(css|less|styl|scss|sass|sss)$': 'identity-obj-proxy',
  },

  // modulePathIgnorePatterns: // [array<string>]
  modulePaths: ['src'],
  setupFiles: ['<rootDir>/test/setupTests.js'],
  testURL: 'http://localhost',
  // timers: // [string]
  verbose: true, // [boolean]
  setupFilesAfterEnv: [
    // ... other setup files ...
  ],
};
