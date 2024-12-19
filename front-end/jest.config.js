module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    "^@services/(.*)$": "<rootDir>/services/$1",
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@types/(.*)$": "<rootDir>/types/$1"
  },
};