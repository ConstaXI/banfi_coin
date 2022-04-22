// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BanfiCoin is ERC20 {
    constructor(uint256 initialSupply) ERC20("BanfiCoin", "BFC") {
        _mint(msg.sender, initialSupply);
    }
}