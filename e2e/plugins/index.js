const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');
const cypressReplay = require("@replayio/cypress");

module.exports = (on, config) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);
  cypressReplay.default(on, config);

  return config;
};
