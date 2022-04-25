const Ducats = artifacts.require("Ducats.sol")

const BN = require("bn.js")

const chai = require("./setupChai.js")

const expect = chai.expect
const assert = chai.assert

require("dotenv").config({path: "../.env"})

contract("Ducats Test", async (accounts) => {
    const [deployerAccount, recipient] = accounts

    let ducats

    beforeEach(async () => {
        ducats = await Ducats.new(process.env.INITIAL_DUCATS || 1000000)
    })
    
    it("should instantiate smart contract with initial fee of 10%.", async () => {
        const instance = ducats

        return assert.equal((await instance.getFee()).toString(), new BN(10))
    })

    it("should be possible to change fee, if onwer wants to.", async () => {
        const instance = ducats

        await instance.changeFee(20)

        return assert.equal((await instance.getFee()).toString(), new BN(20))
    })

    it("should be possible to send Ducats between accounts.", async () => {
        const sendDucats = 5;

        const instance = ducats

        const totalSupply = await instance.totalSupply()

        assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.toString())

        await instance.transfer(recipient, sendDucats)

        assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.sub(new BN(sendDucats)).toString())

        return assert.equal((await instance.balanceOf(recipient)).toString(), new BN(sendDucats).toString())
    })

    it("should not be possible to send more tokens than available in total.", async () => {
        const instance = ducats

        const balanceOfDeployer = await instance.balanceOf(deployerAccount)

        expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected

        return assert.equal((await instance.balanceOf(deployerAccount)).toString(), balanceOfDeployer.toString())
    })
})