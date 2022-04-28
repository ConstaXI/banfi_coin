// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Vip.sol";
import "./Pausable.sol";

// TODO: change vip to instance instead of inhiritable
contract Ducats is ERC20, Vip, Pausable {
    uint256 private _fee;
    uint256 private _maximumSupply;
    uint256 private _rate;
    uint256 private _donationAmount;
    uint256 private _cooldownTime = 30 days;
    mapping (address => uint256) private _cooldown;

    struct TTransactions {
        address from;
        address to;
        uint256 amount;
    }

    TTransactions[] private _transactions;

    using SafeMath for uint256;

    /**
     * @dev Set the values of _maximumSupply, donationAmount, rate and fee.
     *
     * donationAmount - how much user will get with donate function
     * maximumSupply - how many coins can be generated
     * rate - how many ducats user will receive per wei
     * fee - how much the contract will receive from taxes, must be a percentage
     * 
     */
    constructor(uint256 maximumSupply, uint256 donationAmount, uint256 rate, uint256 fee) ERC20("Ducats", "DUC") {
        _maximumSupply = maximumSupply;
        _donationAmount = donationAmount;
        require(fee >= 0 && fee <= 100, "The fee must be a number between 0 and 100.");
        _fee = fee;
        _rate = rate;
    }

    modifier willReachMaximumSuppy(uint256 value) {
        require(
            totalSupply().add(value) <= _maximumSupply,
            "Contract reached its maximum supply, cannot mint more coins."
        );
        _;
    }

    function buy() public payable willReachMaximumSuppy(_rate.mul(msg.value)) {
        require(msg.value >= _rate, "The amount is not higher than minimum.");

        _mint(msg.sender, _rate.mul(msg.value));
    }

    function _isReady(address account) private view returns (bool) {
        return _cooldown[account] <= block.timestamp;
    }

    function _triggerCooldown(address account) private {
        _cooldown[account] = uint32(block.timestamp + _cooldownTime);
    }

    function donate() public willReachMaximumSuppy(_donationAmount) {
        require(_isReady(msg.sender), "The cooldown between donations is 30 days.");
        _mint(msg.sender, _donationAmount);
        _triggerCooldown(msg.sender);
    }

    // TODO: verify assembly
    function transfer(address to, uint256 amount)
        public
        virtual
        override
        isPaused
        returns (bool)
    {
        if (!_isVip(msg.sender)) {
            uint256 tax = _fee.mul(amount).div(100);

            require(
                balanceOf(msg.sender) >= amount.add(tax),
                "You don't have enought money to pay the fee."
            );

            _transfer(msg.sender, address(this), tax);
        }

        _transfer(msg.sender, to, amount);
        _transactions.push(TTransactions(msg.sender, to, amount));

        return true;
    }

    function getTransactions() public view returns(TTransactions[] memory) {
        return _transactions;
    }

    function collectTaxes() public onlyOwner {
        _transfer(address(this), msg.sender, balanceOf(address(this)));
    }

    function setFee(uint256 amount) public onlyOwner {
        require(amount >= 0 && amount <= 100, "The fee must be a number between 0 and 100.");
        _fee = amount;
    }

    function getFee() public view returns(uint256) {
        return _fee;
    }

    function setMaximum(uint256 amount) public onlyOwner {
        _maximumSupply = amount;
    }

    function getMaximum() public view returns(uint256) {
        return _maximumSupply;
    }
}
