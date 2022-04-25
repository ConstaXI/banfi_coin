const ducats = artifacts.require("Ducats.sol")

require("dotenv").config({ path: "../.env" })

module.exports = async function(deployer) {
  const addresses = await web3.eth.getAccounts()

  await deployer.deploy(ducats, process.env.INITIAL_DUCATS)
}