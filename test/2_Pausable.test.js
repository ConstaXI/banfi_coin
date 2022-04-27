const Ducats = artifacts.require("Ducats.sol")
const Pausable = artifacts.require("Pausable.sol")

const chai = require("./setupChai.js")

const assert = chai.assert

require("dotenv").config({path: "../.env"})

contract("Pausable Test", async (accounts) => {
    let ducatsInstance
    let pausableInstance

    beforeEach(async () => {
        ducatsInstance = await Ducats.new(process.env.INITIAL_DUCATS)
        pausableInstance = await Pausable.new()
    })

    it("Should be possible to change pause state.", async () => {
        await ducatsInstance.buy(20)

        await pausableInstance.changePause(true)

        assert.isRejected(ducatsInstance.transfer(accounts[1], 2))

        await pausableInstance.changePause(false)

        assert.isFulfilled(ducatsInstance.transfer(accounts[1], 2))
    })
})