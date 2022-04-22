const banfiCoin = artifacts.require("BanfiCoin.sol")
const banfiCoinSale = artifacts.require("BanfiCoinSale.sol")

require("dotenv").config({ path: "../.env" })

module.exports = async function(deployer) {
  const addresses = await web3.eth.getAccounts()

  await deployer.deploy(banfiCoin, process.env.INITIAL_BANFICOINS || 1000)
  await deployer.deploy(banfiCoinSale, 1, addresses[0], banfiCoin.address)

  const instance = await banfiCoin.deployed()

  await instance.transfer(banfiCoinSale.address, process.env.INITIAL_BANFICOINS || 1000)
}