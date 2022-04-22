const BanfiCoin = artifacts.require("BanfiCoin.sol")

const BN = web3.utils.BN

require("dotenv").config({path: "../.env"})

contract("BanfiCoin Test", async (accounts) => {
    const [deployerAccount, recipient] = accounts

    let banfiCoin

    beforeEach(async () => {
        banfiCoin = await BanfiCoin.new(process.env.INITIAL_BanfiCoinS || 1000000)
    })
    
    it("all BanfiCoins sould be in my account", async () => {
        const instance = banfiCoin

        const totalSupply = await instance.totalSupply()

        return assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.toString())
    })

    it("is possible to send BanfiCoins between accounts", async () => {
        const sendTokens = 1;

        const instance = banfiCoin

        const totalSupply = await instance.totalSupply()

        assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.toString())

        await instance.transfer(recipient, sendTokens)

        assert.equal((await instance.balanceOf(deployerAccount)).toString(), totalSupply.sub(new BN(sendTokens)).toString())

        return assert.equal((await instance.balanceOf(recipient)).toString(), new BN(sendTokens).toString())
    })
})