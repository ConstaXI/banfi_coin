const Ducats = artifacts.require("Ducats.sol")

const BN = require("bn.js")

const chai = require("./setupChai.js")

const expect = chai.expect
const assert = chai.assert

require("dotenv").config({path: "../.env"})

contract("Ducats Test", async (accounts) => {
    const [deployerAccount, account1] = accounts

    let ducats

    beforeEach(async () => {
        ducats = await Ducats.new(process.env.INITIAL_DUCATS)
    })
    
    it("should instantiate smart contract with initial fee of 10%.", async () => {
        const instance = ducats

        return assert.equal((await instance.getFee()).toString(), new BN(10))
    })

    it("should be possible to set fee, if onwer wants to.", async () => {
        const instance = ducats

        await instance.setFee(20)

        return assert.equal((await instance.getFee()).toString(), new BN(20))
    })

    it("should not be possible to set fee higher than 100 or lower than 0.", async () => {
        const instance = ducats

        expect(instance.setFee(-1)).to.eventually.be.rejected

        expect(instance.setFee(101)).to.eventually.be.rejected

        assert.equal((await instance.getFee()).toString(), new BN(10))
    })

    it("should be possible to buy ducats.", async () => {
        const ducatsToBuy = 10

        const instance = ducats

        await instance.buy(ducatsToBuy)

        assert.equal((await instance.balanceOf(deployerAccount)).toString(), ducatsToBuy);
    })

    it("should not be possible to buy ducats if maximum supply was reached.", async () => {
        const instance = ducats

        const ducatsToBuy = new BN(await instance.getMaximum() + 1)

        return expect(instance.buy(ducatsToBuy + 1)).to.eventually.be.rejected
    })
})