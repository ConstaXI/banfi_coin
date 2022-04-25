// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ducats is ERC20, Ownable {
    mapping (address => uint) ownerToDucats;
    uint fee;

    constructor(uint256 initialSupply) ERC20("Ducats", "DUC") {
        _mint(msg.sender, initialSupply);
        fee = 10;
    }

    function changeFee(uint amount) public onlyOwner {
        require(amount >= 0 && amount <= 100, "The fee must be a percentage.");
        fee = amount;
    }

    function getFee() public view returns(uint) {
        return fee;
    }
}