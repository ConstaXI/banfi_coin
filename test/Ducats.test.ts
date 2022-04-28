import BN from "bn.js"
import chai from "./setupChai"
import { DucatsInstance } from '../types/truffle-contracts/Ducats';
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })

const Ducats = artifacts.require("Ducats")

const assert = chai.assert

contract("Ducats Test", async (accounts) => {
    let instance: DucatsInstance

    const oneEther = new BN("1000000000000000000")
    const rate = new BN(process.env.RATE as string)
    const fee = new BN(process.env.FEE as string)

    beforeEach(async () => {
        instance = await Ducats.new(
            process.env.INITIAL_DUCATS as string,
            process.env.DONATION_AMOUNT as string,
            process.env.RATE as string,
            process.env.FEE as string
        )
    })

    it("should be possible to set fee, if onwer wants to.", async () => {
        const newFee = 25

        await instance.setFee(25)

        assert.equal((await instance.getFee()).toString(), newFee.toString())
    })

    it("should not be possible to set fee higher than 100 or lower than 0.", async () => {
        assert.isRejected(instance.setFee(-1))

        assert.isRejected(instance.setFee(101))

        assert.equal((await instance.getFee()).toString(), fee.toString())
    })

    it("should be possible to buy ducats.", async () => {
        await instance.buy({ value: oneEther })

        assert.equal((await instance.balanceOf(accounts[0])).toString(), oneEther.mul(rate).toString())
    })

    it("should not be possible to buy ducats if maximum supply was reached.", async () => {
        const ducatsToBuy = (await instance.getMaximum()).add(new BN(1))

        assert.isRejected(instance.buy({ value: ducatsToBuy.add(new BN(1)) }))
    })

    it("should be possible to mint coins for free monthly", async () => {
        await instance.donate()

        assert.equal((await instance.balanceOf(accounts[0])).toString(), process.env.DONATION_AMOUNT)
    })

    it("should not be possible to mint coins until cooldown ends", async () => {
        await instance.donate()

        assert.isRejected(instance.donate())

        assert.equal((await instance.balanceOf(accounts[0])).toString(), process.env.DONATION_AMOUNT)
    })

    it("should be possible to transfer ducats between accounts.", async () => {
        const ducatsToTransfer = oneEther.div(new BN(100))

        await instance.buy({ from: accounts[1], value: oneEther })

        await instance.transfer(accounts[2], ducatsToTransfer, { from: accounts[1] })

        assert.equal((await instance.balanceOf(accounts[2])).toString(), ducatsToTransfer.toString())

        assert.equal((await instance.balanceOf(accounts[1])).toString(), oneEther.mul(rate).sub(ducatsToTransfer).sub(fee.mul(ducatsToTransfer).div(new BN(100))).toString())
    })

    it("should be possible to see array of transferences.", async () => {
        const ducatsToTransfer = 100

        await instance.buy({ from: accounts[1], value: oneEther })

        await instance.transfer(accounts[2], ducatsToTransfer, { from: accounts[1] })

        const transactions = await instance.getTransactions()

        assert.isArray(transactions)

        assert.equal(transactions.length, 1)

        assert.equal(transactions[0].amount.toString(), "100")

        assert.equal(transactions[0].from, accounts[1])

        assert.equal(transactions[0].to, accounts[2])
    })

    it("should be possible to collect taxes.", async () => {
        const ducatsToTransfer = 100

        await instance.buy({ from: accounts[1], value: oneEther })

        await instance.transfer(accounts[2], ducatsToTransfer, { from: accounts[1] })

        assert.equal((await instance.balanceOf(instance.address)).toString(), (ducatsToTransfer * fee.toNumber() / 100).toString())

        await instance.collectTaxes({ from: accounts[0] })

        assert.equal((await instance.balanceOf(accounts[0])).toString(), (ducatsToTransfer * fee.toNumber() / 100).toString())
    })
})