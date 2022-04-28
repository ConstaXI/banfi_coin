import chai from "./setupChai"
import { VipInstance } from "../types/truffle-contracts/Vip"
import { DucatsInstance } from '../types/truffle-contracts/Ducats';
import dotenv from "dotenv"
import BN from "bn.js";

const Ducats = artifacts.require("Ducats")
const Vip = artifacts.require("Vip")
const assert = chai.assert

dotenv.config({ path: "../.env" })

contract("Vip Test", async (accounts) => {
    let ducatsInstance: DucatsInstance
    let vipInstance: VipInstance

    const oneEther = new BN("1000000000000000000")
    const fee = new BN(process.env.FEE as string)

    beforeEach(async () => {
        ducatsInstance = await Ducats.new(            
            process.env.INITIAL_DUCATS as string, 
            process.env.DONATION_AMOUNT as string,
            process.env.RATE as string, 
            process.env.FEE as string
        )
        vipInstance = await Vip.new()
    })

    it("Should be possible to set someone vip.", async () => {
        assert.isFulfilled(vipInstance.setVip(accounts[1]))
    })

    it("Should be possible to remove someone vip.", async () => {
        await vipInstance.setVip(accounts[1])

        assert.isFulfilled(vipInstance.removeVip(accounts[1]))

        const ducatsToTransfer = new BN("1000000")

        await ducatsInstance.buy({ from: accounts[1], value: oneEther })

        await ducatsInstance.transfer(accounts[2], ducatsToTransfer, { from: accounts[1] })

        assert.equal((await ducatsInstance.balanceOf(ducatsInstance.address)).toString(), ducatsToTransfer.mul(fee).div(new BN(100)).toString())
    })

    it("Should not demand fee of vip users.", async () => {
        await vipInstance.setVip(accounts[1])

        await ducatsInstance.buy({ value: oneEther })

        assert.isFulfilled(ducatsInstance.transfer(accounts[2], oneEther, { from: accounts[1] }))

        assert.equal((await ducatsInstance.balanceOf(ducatsInstance.address)).toString(), "0")
    })
})