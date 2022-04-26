const Ducats = artifacts.require("Ducats.sol")
const Pausable = artifacts.require("Pausable.sol")

const chai = require("./setupChai.js")

const expect = chai.expect

require("dotenv").config({path: "../.env"})

contract("Pausable Test", async (accounts) => {
    const getPausable = async (index = 0) => {
        return Pausable.new({ from: accounts[index] })
    }

    const getDucats = async (index = 0) => {
        return Ducats.new(process.env.INITIAL_DUCATS, { from: accounts[index] })
    }

    it("Should be possible to change pause state.", async () => {
        const pausableInstance = await getPausable()

        const ducatsInstance = await getDucats()

        await ducatsInstance.buy(20)

        await pausableInstance.changePause(true)

        expect(ducatsInstance.transfer(accounts[1], 2)).to.eventually.be.rejected

        await pausableInstance.changePause(false)

        expect(ducatsInstance.transfer(accounts[1], 2)).to.eventually.be.fulfilled
    })
})