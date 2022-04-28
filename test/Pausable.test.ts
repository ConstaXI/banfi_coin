import { DucatsInstance } from '../types/truffle-contracts/Ducats';
import { PausableInstance } from '../types/truffle-contracts/Pausable';
import chai from "./setupChai";
import dotenv from "dotenv"
import BN from 'bn.js';

const Ducats = artifacts.require("Ducats")
const Pausable = artifacts.require("Pausable")

const assert = chai.assert

dotenv.config({ path: "../.env" })

contract("Pausable Test", async (accounts) => {
    let ducatsInstance: DucatsInstance
    let pausableInstance: PausableInstance

    beforeEach(async () => {
        ducatsInstance = await Ducats.new(            
            process.env.INITIAL_DUCATS as string, 
            process.env.DONATION_AMOUNT as string,
            process.env.RATE as string, 
            process.env.FEE as string
        )
        pausableInstance = await Pausable.new()
    })

    it("Should be possible to change pause state.", async () => {
        await ducatsInstance.buy({ value: new BN("1000000000000000000") })

        await pausableInstance.changePause(true)

        await ducatsInstance.transfer(accounts[1], 2).catch(e => assert.instanceOf(e, Error))

        await pausableInstance.changePause(false)

        await ducatsInstance.transfer(accounts[1], 2).catch(() => assert.fail())
    })
})