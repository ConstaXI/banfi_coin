const Ducats = artifacts.require("Ducats.sol")
const Vip = artifacts.require("Vip.sol")

const chai = require("./setupChai.js")

const assert = chai.assert

require("dotenv").config({path: "../.env"})

contract("Vip Test", async (accounts) => {
    let ducatsInstance
    let vipInstance

    beforeEach(async () => {
        ducatsInstance = await Ducats.new(process.env.INITIAL_DUCATS)
        vipInstance = await Vip.new()
    })

    it("Should be possible to set someone vip.", async () => {
        return assert.isFulfilled(vipInstance.setVip(accounts[1]))
    })

    it("Should not demand fee of vip users.", async () => {
        await vipInstance.setVip(accounts[1])

        await ducatsInstance.buy(20)

        return assert.isFulfilled(ducatsInstance.transfer(accounts[2], 20), { from: accounts[1] })
    })
})