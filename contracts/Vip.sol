// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vip is Ownable {
    mapping (address => bool) vips;

    constructor() {
        vips[msg.sender] = true;
    }

    function _isVip(address target) internal view returns(bool) {
        return vips[target];
    }

    // TODO: remove vip too
    function setVip(address target) public onlyOwner {
        vips[target] = true;
    }
}