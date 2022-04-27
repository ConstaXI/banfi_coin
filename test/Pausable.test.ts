import { DucatsInstance } from '../types/truffle-contracts/Ducats';
import { PausableInstance } from '../types/truffle-contracts/Pausable';
import chai from "./setupChai";
import dotenv from "dotenv"

const Ducats = artifacts.require("Ducats")
const Pausable = artifacts.require("Pausable")

const assert = chai.assert

dotenv.config({ path: "../.env" })

contract("Pausable Test", async (accounts) => {
    let ducatsInstance: DucatsInstance
    let pausableInstance: PausableInstance

    beforeEach(async () => {
        ducatsInstance = await Ducats.new(process.env.INITIAL_DUCATS as string)
        pausableInstance = await Pausable.new()
    })

    it("Should be possible to change pause state.", async () => {
        await ducatsInstance.buy(20)

        await pausableInstance.changePause(true)

        await ducatsInstance.transfer(accounts[1], 2).catch(e => assert.instanceOf(e, Error))

        await pausableInstance.changePause(false)

        await ducatsInstance.transfer(accounts[1], 2).catch(() => assert.fail())
    })
})