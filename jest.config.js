module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
  };
  