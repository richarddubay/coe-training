const config = {
    globalSetup: "./test-setup/global-setup.js",
    globalTeardown: "./test-setup/global-teardown.js",
    clearMocks: true,
    testTimeout: 1500,
    testEnvironment: "node",
    preset: "ts-jest",
  };
  
  export default config;
  