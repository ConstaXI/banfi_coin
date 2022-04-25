// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Ducats is ERC20, Ownable {
    uint256 fee;
    uint256 private maximumSupply;
    uint private ducatsFromContract;

    using SafeMath for uint256;

    constructor(uint256 maximum) ERC20("Ducats", "DUC") {
        maximumSupply = maximum;
        fee = 10;
    }

    function buy(uint256 amount) public {
        require(totalSupply().add(amount) <= maximumSupply, "Contract reached its maximum supply, cannot mint more coins.");
        _mint(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) public virtual override returns(bool) {
        uint tax = amount.div(fee);
        require(balanceOf(msg.sender) >= amount.add(tax), "You don't have enought money to pay the fee.");

        _transfer(msg.sender, to, amount);
        _transfer(msg.sender, address(this), tax);

        return true;
    }

    function setFee(uint amount) public onlyOwner {
        require(amount >= 0 && amount <= 100, "The fee must be a percentage.");
        fee = amount;
    }

    function getFee() public view returns(uint) {
        return fee;
    }

    function setMaximum(uint amount) public onlyOwner {
        maximumSupply = amount;
    }

    function getMaximum() public view returns(uint) {
        return maximumSupply;
    }
}