// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AlbashSwapEscrow
 * @dev Escrow contract for value swaps (Idea ↔ Idea, Skill ↔ Product, etc.)
 */
contract AlbashSwapEscrow {
    enum SwapStatus {
        Pending,
        Accepted,
        Completed,
        Cancelled,
        Disputed
    }

    struct Swap {
        address partyA;
        address partyB;
        uint256 valueA; // In wei
        uint256 valueB; // In wei
        uint256 tokenIdA; // NFT token ID if applicable (0 if not NFT)
        uint256 tokenIdB; // NFT token ID if applicable (0 if not NFT)
        SwapStatus status;
        uint256 createdAt;
        uint256 acceptedAt;
        uint256 completedAt;
        string metadataURI; // IPFS or other metadata
    }

    address public admin;
    uint256 public swapCounter;
    mapping(uint256 => Swap) public swaps;

    event SwapCreated(
        uint256 indexed swapId,
        address indexed partyA,
        address indexed partyB,
        uint256 valueA,
        uint256 valueB
    );
    event SwapAccepted(uint256 indexed swapId);
    event SwapCompleted(uint256 indexed swapId);
    event SwapCancelled(uint256 indexed swapId, address indexed cancelledBy);
    event SwapDisputed(uint256 indexed swapId, address indexed disputedBy);

    modifier onlyParty(uint256 swapId) {
        Swap storage s = swaps[swapId];
        require(
            msg.sender == s.partyA || msg.sender == s.partyB,
            "Not a party to this swap"
        );
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createSwap(
        address partyB,
        uint256 valueA,
        uint256 valueB,
        uint256 tokenIdA,
        uint256 tokenIdB,
        string memory metadataURI
    ) external payable returns (uint256) {
        require(partyB != address(0), "Invalid partyB address");
        require(partyB != msg.sender, "Cannot swap with yourself");
        
        // If valueA > 0, require payment
        if (valueA > 0) {
            require(msg.value >= valueA, "Insufficient payment for swap");
        }

        swapCounter++;
        swaps[swapCounter] = Swap({
            partyA: msg.sender,
            partyB: partyB,
            valueA: valueA,
            valueB: valueB,
            tokenIdA: tokenIdA,
            tokenIdB: tokenIdB,
            status: SwapStatus.Pending,
            createdAt: block.timestamp,
            acceptedAt: 0,
            completedAt: 0,
            metadataURI: metadataURI
        });

        emit SwapCreated(swapCounter, msg.sender, partyB, valueA, valueB);
        return swapCounter;
    }

    function acceptSwap(uint256 swapId) external payable {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Pending, "Swap not pending");
        require(msg.sender == s.partyB, "Not the target party");
        
        // If valueB > 0, require payment
        if (s.valueB > 0) {
            require(msg.value >= s.valueB, "Insufficient payment for swap");
        }

        s.status = SwapStatus.Accepted;
        s.acceptedAt = block.timestamp;

        emit SwapAccepted(swapId);
    }

    function completeSwap(uint256 swapId) external onlyParty(swapId) {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Accepted, "Swap not accepted");

        s.status = SwapStatus.Completed;
        s.completedAt = block.timestamp;

        // Transfer funds (simple version - in production, handle NFT transfers separately)
        if (s.valueA > 0 && s.valueB > 0) {
            // Both parties pay - exchange the values
            payable(s.partyB).transfer(s.valueA);
            payable(s.partyA).transfer(s.valueB);
        } else if (s.valueA > 0) {
            // Only partyA paid - give to partyB
            payable(s.partyB).transfer(s.valueA);
        } else if (s.valueB > 0) {
            // Only partyB paid - give to partyA
            payable(s.partyA).transfer(s.valueB);
        }

        emit SwapCompleted(swapId);
    }

    function cancelSwap(uint256 swapId) external onlyParty(swapId) {
        Swap storage s = swaps[swapId];
        require(
            s.status == SwapStatus.Pending || s.status == SwapStatus.Accepted,
            "Cannot cancel"
        );

        s.status = SwapStatus.Cancelled;

        // Refund if partyA paid
        if (s.valueA > 0 && s.partyA == msg.sender) {
            payable(s.partyA).transfer(s.valueA);
        }
        // Refund if partyB paid (in case they already accepted)
        if (s.valueB > 0 && s.partyB == msg.sender && s.status == SwapStatus.Accepted) {
            payable(s.partyB).transfer(s.valueB);
        }

        emit SwapCancelled(swapId, msg.sender);
    }

    function disputeSwap(uint256 swapId) external onlyParty(swapId) {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Accepted, "Swap must be accepted to dispute");
        s.status = SwapStatus.Disputed;
        emit SwapDisputed(swapId, msg.sender);
    }

    function resolveDispute(uint256 swapId, bool complete) external onlyAdmin {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Disputed, "Swap not disputed");
        
        if (complete) {
            s.status = SwapStatus.Completed;
            s.completedAt = block.timestamp;
            emit SwapCompleted(swapId);
        } else {
            s.status = SwapStatus.Cancelled;
            emit SwapCancelled(swapId, admin);
        }
    }
}
