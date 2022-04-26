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

    function setVip(address target) public {
        vips[target] = true;
    }
}