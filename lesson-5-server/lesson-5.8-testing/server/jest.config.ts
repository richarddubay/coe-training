/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true,
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
