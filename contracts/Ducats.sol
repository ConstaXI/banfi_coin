// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ducats is ERC20 {
    constructor(uint256 initialSupply) ERC20("Ducats", "DUC") {
        _mint(msg.sender, initialSupply);
    }
}