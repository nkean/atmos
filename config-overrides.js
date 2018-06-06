/* config-overrides.js */
const rewireAntd = require('react-app-rewire-antd');

module.exports = function override(config, env) {
  // change default antd configuration variables
  config = rewireAntd({})(config, env);

  // apply these changes to the webpack config
  return config;
};