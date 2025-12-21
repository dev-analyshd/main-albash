// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AlbashReputation
 * @dev Non-transferable reputation scoring system
 */
contract AlbashReputation {
    address public admin;
    address public accessControl;

    mapping(address => uint256) public reputation;

    event ReputationUpdated(address indexed user, uint256 score, string reason);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyAccessControl() {
        require(msg.sender == accessControl || msg.sender == admin, "Not authorized");
        _;
    }

    constructor(address _accessControl) {
        admin = msg.sender;
        accessControl = _accessControl;
    }

    function increaseReputation(address user, uint256 amount, string memory reason) external onlyAccessControl {
        require(user != address(0), "Invalid address");
        reputation[user] += amount;
        emit ReputationUpdated(user, reputation[user], reason);
    }

    function decreaseReputation(address user, uint256 amount, string memory reason) external onlyAccessControl {
        require(user != address(0), "Invalid address");
        if (reputation[user] > amount) {
            reputation[user] -= amount;
        } else {
            reputation[user] = 0;
        }
        emit ReputationUpdated(user, reputation[user], reason);
    }

    function setAccessControl(address _accessControl) external onlyAdmin {
        require(_accessControl != address(0), "Invalid address");
        accessControl = _accessControl;
    }

    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminChanged(oldAdmin, _newAdmin);
    }
}
