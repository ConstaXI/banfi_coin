const Ducats = artifacts.require("Ducats.sol")

const BN = web3.utils.BN

require("dotenv").config({path: "../.env"})

contract("Ducats Test", async (accounts) => {
    const [deployerAccount, recipient] = accounts

    let ducats

    beforeEach(async () => {
        ducats = await Ducats.new(process.env.INITIAL_DUCATS || 1000000)
    })
    
    it("all Ducatss sould be in my account", async () => {
        const instance = ducats

        const totalSupply = await instance.totalSupply()

        return assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.toString())
    })

    it("is possible to send Ducatss between accounts", async () => {
        const sendTokens = 1;

        const instance = ducats

        const totalSupply = await instance.totalSupply()

        assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.toString())

        await instance.transfer(recipient, sendTokens)

        assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.sub(new BN(sendTokens)).toString())

        return assert.equal((await instance.balanceOf(recipient)).toString(), new BN(sendTokens).toString())
    })
})