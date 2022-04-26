const Ducats = artifacts.require("Ducats.sol")
const Vip = artifacts.require("Vip.sol")

const chai = require("./setupChai.js")

const expect = chai.expect

require("dotenv").config({path: "../.env"})

contract("Vip Test", async (accounts) => {
    const getVip = async (index = 0) => {
        return Vip.new({ from: accounts[index] })
    }

    const getDucats = async (index = 0) => {
        return Ducats.new(process.env.INITIAL_DUCATS, { from: accounts[index] })
    }

    it("Should be possible to set someone vip.", async () => {
        const vipInstance = await getVip()

        const ducatsInstance = await getDucats(1)

        await vipInstance.setVip(accounts[1])

        await ducatsInstance.buy(20)

        expect(ducatsInstance.transfer(accounts[0], 20)).to.eventually.be.fulfilled
    })
})