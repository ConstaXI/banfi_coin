import dotenv from 'dotenv'

dotenv.config({ path: "../.env" })

type Network = "development" | "kovan" | "mainnet";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: string[]
  ) => {
    const ducats = artifacts.require("Ducats")
    const vip = artifacts.require("Vip")
    const pausable = artifacts.require("Pausable")

    deployer.deploy(vip)
    deployer.deploy(pausable)
    deployer.deploy(ducats, process.env.INITIAL_DUCATS as string)

    console.log(`Ducats deployed at ${ducats.address} in network: ${network}.`)
  };
};