const ducats = artifacts.require("Ducats.sol")
const vip = artifacts.require("Vip.sol")
const pausable = artifacts.require("Pausable.sol")

require("dotenv").config({ path: "../.env" })

module.exports = async function(deployer) {
  await deployer.deploy(vip)
  await deployer.deploy(pausable)
  await deployer.deploy(ducats, process.env.INITIAL_DUCATS, process.env.INITIAL_DUCATS)
}