const Ducats = artifacts.require("Ducats.sol")

const BN = require("bn.js")

const chai = require("./setupChai.js")

const assert = chai.assert

require("dotenv").config({ path: "../.env" })

contract("Ducats Test", async (accounts) => {
    let instance

    beforeEach(async () => {
        instance = await Ducats.new(process.env.INITIAL_DUCATS)
    })

    it("should be possible to set fee, if onwer wants to.", async () => {
        await instance.setFee(20)

        assert.equal((await instance.getFee()).toString(), new BN(20))
    })

    it("should not be possible to set fee higher than 100 or lower than 0.", async () => {
        assert.isRejected(instance.setFee(-1))

        assert.isRejected(instance.setFee(101))

        assert.equal((await instance.getFee()).toString(), new BN(10))
    })

    it("should be possible to buy ducats.", async () => {
        const ducatsToBuy = 10

        await instance.buy(ducatsToBuy)

        assert.equal((await instance.balanceOf(accounts[0])).toString(), ducatsToBuy)
    })

    it("should not be possible to buy ducats if maximum supply was reached.", async () => {
        const ducatsToBuy = new BN(await instance.getMaximum() + 1)

        assert.isRejected(instance.buy(ducatsToBuy + 1))
    })

    it("should be possible to transfer ducats between accounts.", async () => {
        const ducatsToTransfer = 100

        await instance.buy(110, { from: accounts[1] })

        await instance.transfer(accounts[2], ducatsToTransfer, { from: accounts[1] })

        assert.equal((await instance.balanceOf(accounts[2])).toString(), ducatsToTransfer)

        assert.equal((await instance.balanceOf(accounts[1])).toString(), "0")
    })

    it("should be possible to collect taxes.", async () => {
        const fee = await instance.getFee()

        const ducatsToTransfer = 100

        await instance.buy(100000, { from: accounts[1] })

        await instance.transfer(accounts[2], ducatsToTransfer, { from: accounts[1] })

        assert.equal((await instance.balanceOf(instance.address)).toString(), ducatsToTransfer * (fee / 100))

        await instance.collectTaxes({ from: accounts[0] })

        assert.equal((await instance.balanceOf(accounts[0])).toString(), ducatsToTransfer * (fee / 100))
    })
})