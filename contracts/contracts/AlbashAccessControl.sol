// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AlbashAccessControl
 * @dev Core access control and verification registry for AlbashSolution
 */
contract AlbashAccessControl {
    address public admin;

    mapping(address => bool) public verifiers;
    mapping(address => bool) public verifiedUsers;

    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event UserVerified(address indexed user);
    event UserRevoked(address indexed user);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not verifier");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addVerifier(address _verifier) external onlyAdmin {
        require(_verifier != address(0), "Invalid address");
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }

    function removeVerifier(address _verifier) external onlyAdmin {
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }

    function verifyUser(address _user) external onlyVerifier {
        require(_user != address(0), "Invalid address");
        verifiedUsers[_user] = true;
        emit UserVerified(_user);
    }

    function revokeUser(address _user) external onlyVerifier {
        verifiedUsers[_user] = false;
        emit UserRevoked(_user);
    }

    function isVerified(address _user) external view returns (bool) {
        return verifiedUsers[_user];
    }

    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminChanged(oldAdmin, _newAdmin);
    }
}
