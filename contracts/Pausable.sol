// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Pausable is Ownable {
    bool paused;

    constructor() {
        paused = false;
    }

    modifier isPaused() {
        require(!paused, "The transactions are paused.");
        _;
    }

    function changePause(bool status) public onlyOwner {
        paused = status;
    }
}