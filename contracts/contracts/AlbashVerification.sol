// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AlbashVerification
 * @dev Global verification authority for AlbashSolution Bridge
 * 
 * Rules:
 * - One verification = global access across Web2 + Web3
 * - Verification statuses: UNVERIFIED → PENDING → VERIFIED or REJECTED
 * - Admin can revoke verification at any time
 * - Events emitted for all state changes
 */
contract AlbashVerification is Ownable {
    
    enum Status {
        UNVERIFIED,    // 0: Initial state
        PENDING,       // 1: Awaiting admin review
        VERIFIED,      // 2: Approved, full access
        SUSPENDED,     // 3: Temporarily suspended
        REVOKED        // 4: Permanently revoked
    }

    struct VerificationDetails {
        Status status;
        uint256 requestedAt;
        uint256 verifiedAt;
        address verifiedBy;
        string entityType; // builder, institution, company, org, individual
        bool kycCompleted;
    }

    // Mapping of address to verification status
    mapping(address => VerificationDetails) public verifications;
    
    // Mapping of request ID to address (for off-chain tracking)
    mapping(bytes32 => address) public requestIdToAddress;
    
    // Array of verified addresses (for statistics)
    address[] public verifiedAddresses;
    
    // Admin addresses that can approve/reject
    mapping(address => bool) public admins;
        // Pause state
        bool private paused;
    
    
    // Events
    event VerificationRequested(
        address indexed user,
        string entityType,
        uint256 timestamp
    );

    event VerificationApproved(
        address indexed user,
        address indexed approvedBy,
        uint256 timestamp
    );

    event VerificationRejected(
        address indexed user,
        address indexed rejectedBy,
        uint256 timestamp
    );

    event VerificationSuspended(
        address indexed user,
        address indexed suspendedBy,
        string reason,
        uint256 timestamp
    );

    event VerificationRevoked(
        address indexed user,
        address indexed revokedBy,
        string reason,
        uint256 timestamp
    );

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    // Modifiers
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner(), "Admin only");
        _;
    }

    modifier onlyVerified(address user) {
        require(verifications[user].status == Status.VERIFIED, "Not verified");
        _;
    }

    modifier onlyUnverified(address user) {
        require(verifications[user].status == Status.UNVERIFIED, "Already applied");
    
            modifier whenNotPaused() {
                require(!paused, "Contract is paused");
                _;
            }
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {
        admins[msg.sender] = true;
        paused = false;
    }

    // ===== Admin Functions =====

    /**
     * @dev Add an admin address
     */
    function addAdmin(address newAdmin) external onlyOwner {
        require(newAdmin != address(0), "Invalid address");
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    /**
     * @dev Remove an admin address
     */
    function removeAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid address");
        admins[admin] = false;
        emit AdminRemoved(admin);
    }

    /**
     * @dev Approve verification request
     */
    function approveVerification(address user) external onlyAdmin whenNotPaused {
        require(user != address(0), "Invalid address");
        require(
            verifications[user].status == Status.PENDING,
            "Not pending verification"
        );

        verifications[user].status = Status.VERIFIED;
        verifications[user].verifiedAt = block.timestamp;
        verifications[user].verifiedBy = msg.sender;

        verifiedAddresses.push(user);

        emit VerificationApproved(user, msg.sender, block.timestamp);
    }

    /**
     * @dev Reject verification request
     */
    function rejectVerification(address user) external onlyAdmin whenNotPaused {
        require(user != address(0), "Invalid address");
        require(
            verifications[user].status == Status.PENDING,
            "Not pending verification"
        );

        verifications[user].status = Status.UNVERIFIED;
        verifications[user].verifiedAt = 0;
        verifications[user].verifiedBy = address(0);

        emit VerificationRejected(user, msg.sender, block.timestamp);
    }

    /**
     * @dev Suspend a verified user
     */
    function suspendVerification(address user, string memory reason)
        external
        onlyAdmin
        whenNotPaused
    {
        require(user != address(0), "Invalid address");
        require(
            verifications[user].status == Status.VERIFIED,
            "Not verified"
        );

        verifications[user].status = Status.SUSPENDED;

        emit VerificationSuspended(user, msg.sender, reason, block.timestamp);
    }

    /**
     * @dev Revoke a user's verification permanently
     */
    function revokeVerification(address user, string memory reason)
        external
        onlyAdmin
        whenNotPaused
    {
        require(user != address(0), "Invalid address");
        require(
            verifications[user].status == Status.VERIFIED ||
                verifications[user].status == Status.SUSPENDED,
            "Not verified"
        );

        verifications[user].status = Status.REVOKED;

        emit VerificationRevoked(user, msg.sender, reason, block.timestamp);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        paused = true;
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        paused = false;
    }

    // ===== User Functions =====

    /**
     * @dev User requests verification
     */
    function requestVerification(string memory entityType)
        external
        onlyUnverified(msg.sender)
        whenNotPaused
    {
        require(bytes(entityType).length > 0, "Entity type required");
        require(bytes(entityType).length <= 50, "Entity type too long");

        verifications[msg.sender].status = Status.PENDING;
        verifications[msg.sender].requestedAt = block.timestamp;
        verifications[msg.sender].entityType = entityType;

        emit VerificationRequested(msg.sender, entityType, block.timestamp);
    }

    // ===== View Functions =====

    /**
     * @dev Check if user is verified
     */
    function isVerified(address user) external view returns (bool) {
        return verifications[user].status == Status.VERIFIED;
    }

    /**
     * @dev Get verification status
     */
    function getStatus(address user)
        external
        view
        returns (Status)
    {
        return verifications[user].status;
    }

    /**
     * @dev Get verification details
     */
    function getVerificationDetails(address user)
        external
        view
        returns (
            Status status,
            uint256 requestedAt,
            uint256 verifiedAt,
            address verifiedBy,
            string memory entityType,
            bool kycCompleted
        )
    {
        VerificationDetails memory details = verifications[user];
        return (
            details.status,
            details.requestedAt,
            details.verifiedAt,
            details.verifiedBy,
            details.entityType,
            details.kycCompleted
        );
    }

    /**
     * @dev Get total verified count
     */
    function getVerifiedCount() external view returns (uint256) {
        return verifiedAddresses.length;
    }

    /**
     * @dev Check if address is admin
     */
    function isAdmin(address admin) external view returns (bool) {
        return admins[admin];
    }

    /**
     * @dev Get verification status as string (for UI)
     */
    function getStatusString(address user)
        external
        view
        returns (string memory)
    {
        Status status = verifications[user].status;
        
        if (status == Status.UNVERIFIED) return "unverified";
        if (status == Status.PENDING) return "pending";
        if (status == Status.VERIFIED) return "verified";
        if (status == Status.SUSPENDED) return "suspended";
        if (status == Status.REVOKED) return "revoked";
        
        return "unknown";
    }
}
