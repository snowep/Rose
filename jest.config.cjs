module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/archive/'],
  testMatch: ['**/__tests__/**/*.[jt]s', '**/?(*.|spec).(c|m)[jt]s'],
  moduleNameMapper: {
    '\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  // transpileOnly: true,
};
