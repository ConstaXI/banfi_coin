const ducats = artifacts.require("Ducats.sol")
const ducatsSale = artifacts.require("DucatsSale.sol")

require("dotenv").config({ path: "../.env" })

module.exports = async function(deployer) {
  const addresses = await web3.eth.getAccounts()

  await deployer.deploy(ducats, process.env.INITIAL_DUCATS || 1000)
  await deployer.deploy(ducatsSale, 1, addresses[0], ducats.address)

  const instance = await ducats.deployed()

  await instance.transfer(ducatsSale.address, process.env.INITIAL_DUCATS || 1000)
}