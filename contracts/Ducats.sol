// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Vip.sol";
import "./Pausable.sol";

contract Ducats is ERC20, Vip, Pausable {
    uint256 private fee;
    uint256 private maximumSupply;

    using SafeMath for uint256;

    constructor(uint256 maximum) ERC20("Ducats", "DUC") {
        maximumSupply = maximum;
        fee = 10;
    }

    function buy(uint256 amount) public {
        require(
            totalSupply().add(amount) <= maximumSupply,
            "Contract reached its maximum supply, cannot mint more coins."
        );
        _mint(msg.sender, amount);
    }

    function transfer(address to, uint256 amount)
        public
        virtual
        override
        isPaused
        returns (bool)
    {
        if (!_isVip(msg.sender)) {
            uint256 tax = fee.mul(amount).div(100);

            require(
                balanceOf(msg.sender) >= amount.add(tax),
                "You don't have enought money to pay the fee."
            );

            _transfer(msg.sender, address(this), tax);
        }

        _transfer(msg.sender, to, amount);

        return true;
    }

    function collectTaxes() public onlyOwner {
        _transfer(address(this), msg.sender, balanceOf(address(this)));
    }

    function setFee(uint256 amount) public onlyOwner {
        require(amount >= 0 && amount <= 100, "The fee must be a percentage.");
        fee = amount;
    }

    function getFee() public view returns(uint256) {
        return fee;
    }

    function setMaximum(uint256 amount) public onlyOwner {
        maximumSupply = amount;
    }

    function getMaximum() public view returns(uint256) {
        return maximumSupply;
    }
}
