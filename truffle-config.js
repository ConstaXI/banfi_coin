const path = require("path");

require("ts-node").register({
  files: true,
});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "build/contracts"),
  networks: {
    development: {
      port: 8545,
      host: "localhost",
      network_id: 5777,
      gasPrice: 64000000000
    }
  },
  compilers: {
    solc: {
      version: "0.8.13"
    }
  }
};