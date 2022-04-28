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

    it("Should not demand fee of vip users.", async () => {
        await vipInstance.setVip(accounts[1])

        await ducatsInstance.buy({ value: new BN("1000000000000000000") })

        assert.isFulfilled(ducatsInstance.transfer(accounts[2], 1, { from: accounts[1] }))
    })
})