//global-setup.js

const path = require("path");
const { DockerComposeEnvironment, Wait } = require("testcontainers");

// https://node.testcontainers.org/features/compose/
module.exports = async () => {
  const composeFilePath = path.resolve(__dirname, "../../");
  const composeFile = "docker-compose.yml";

  global.__ENVIRONMENT__ = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile
  )
    .withWaitStrategy("flyway-1", Wait.forLogMessage(/^Successfully applied/))
    .up();

  await new Promise((x) => setTimeout(x, 500));
};
