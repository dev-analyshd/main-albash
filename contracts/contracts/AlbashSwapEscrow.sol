// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AlbashSwapEscrow
 * @dev Enhanced escrow contract for value swaps (Idea ↔ Idea, Skill ↔ Product, etc.)
 * Supports ETH, ERC721 NFTs, and ERC1155 tokens with safe transfers and dispute resolution
 */
contract AlbashSwapEscrow is ReentrancyGuard {
    enum SwapStatus {
        Pending,
        Accepted,
        Completed,
        Cancelled,
        Disputed,
        RefundedOnDispute
    }

    enum AssetType {
        ETH,
        ERC721,
        ERC1155
    }

    struct Swap {
        address partyA;
        address partyB;
        uint256 valueA; // In wei (for ETH or ERC1155)
        uint256 valueB; // In wei (for ETH or ERC1155)
        uint256 tokenIdA; // NFT token ID (0 if not NFT)
        uint256 tokenIdB; // NFT token ID (0 if not NFT)
        address nftContractA; // ERC721/1155 contract address for partyA
        address nftContractB; // ERC721/1155 contract address for partyB
        AssetType assetTypeA;
        AssetType assetTypeB;
        SwapStatus status;
        uint256 createdAt;
        uint256 acceptedAt;
        uint256 completedAt;
        uint256 disputedAt;
        string metadataURI; // IPFS or other metadata
    }

    address public admin;
    uint256 public swapCounter;
    uint256 public disputeResolutionWindow = 7 days; // Time window for admin to resolve disputes
    mapping(uint256 => Swap) public swaps;

    event SwapCreated(
        uint256 indexed swapId,
        address indexed partyA,
        address indexed partyB,
        uint256 valueA,
        uint256 valueB,
        AssetType assetTypeA,
        AssetType assetTypeB
    );
    event SwapAccepted(uint256 indexed swapId, uint256 timestamp);
    event SwapCompleted(uint256 indexed swapId, uint256 timestamp);
    event SwapCancelled(uint256 indexed swapId, address indexed cancelledBy, uint256 timestamp);
    event SwapDisputed(uint256 indexed swapId, address indexed disputedBy, uint256 timestamp);
    event DisputeResolved(uint256 indexed swapId, bool completed, address indexed resolvedBy);
    event FundsRefunded(uint256 indexed swapId, address indexed recipient, uint256 amount);
    event NFTTransferred(uint256 indexed swapId, address indexed nftContract, address indexed to, uint256 tokenId);

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

    /**
     * @dev Create a new swap with flexible asset types (ETH, ERC721, ERC1155)
     */
    function createSwap(
        address partyB,
        uint256 valueA,
        uint256 valueB,
        uint256 tokenIdA,
        uint256 tokenIdB,
        address nftContractA,
        address nftContractB,
        AssetType assetTypeA,
        AssetType assetTypeB,
        string memory metadataURI
    ) external payable nonReentrant returns (uint256) {
        require(partyB != address(0), "Invalid partyB address");
        require(partyB != msg.sender, "Cannot swap with yourself");
        
        // Validate asset types
        if (assetTypeA == AssetType.ERC721 || assetTypeA == AssetType.ERC1155) {
            require(nftContractA != address(0), "NFT contract required for assetTypeA");
        }
        if (assetTypeB == AssetType.ERC721 || assetTypeB == AssetType.ERC1155) {
            require(nftContractB != address(0), "NFT contract required for assetTypeB");
        }

        // If valueA > 0 and type is ETH, require payment
        if (assetTypeA == AssetType.ETH && valueA > 0) {
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
            nftContractA: nftContractA,
            nftContractB: nftContractB,
            assetTypeA: assetTypeA,
            assetTypeB: assetTypeB,
            status: SwapStatus.Pending,
            createdAt: block.timestamp,
            acceptedAt: 0,
            completedAt: 0,
            disputedAt: 0,
            metadataURI: metadataURI
        });

        emit SwapCreated(swapCounter, msg.sender, partyB, valueA, valueB, assetTypeA, assetTypeB);
        return swapCounter;
    }

    /**
     * @dev Accept a pending swap (partyB must call this)
     */
    function acceptSwap(uint256 swapId) external payable nonReentrant {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Pending, "Swap not pending");
        require(msg.sender == s.partyB, "Not the target party");
        
        // If valueB > 0 and type is ETH, require payment
        if (s.assetTypeB == AssetType.ETH && s.valueB > 0) {
            require(msg.value >= s.valueB, "Insufficient payment for swap");
        }

        s.status = SwapStatus.Accepted;
        s.acceptedAt = block.timestamp;

        emit SwapAccepted(swapId, block.timestamp);
    }

    /**
     * @dev Complete swap with safe transfers for both ETH and NFTs
     */
    function completeSwap(uint256 swapId) external nonReentrant onlyParty(swapId) {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Accepted, "Swap not accepted");

        s.status = SwapStatus.Completed;
        s.completedAt = block.timestamp;

        // Transfer partyA's assets to partyB
        _transferAsset(s.partyA, s.partyB, s.assetTypeA, s.nftContractA, s.valueA, s.tokenIdA, swapId);

        // Transfer partyB's assets to partyA
        _transferAsset(s.partyB, s.partyA, s.assetTypeB, s.nftContractB, s.valueB, s.tokenIdB, swapId);

        emit SwapCompleted(swapId, block.timestamp);
    }

    /**
     * @dev Internal helper to transfer ETH or NFTs safely
     */
    function _transferAsset(
        address from,
        address to,
        AssetType assetType,
        address nftContract,
        uint256 value,
        uint256 tokenId,
        uint256 swapId
    ) internal {
        if (assetType == AssetType.ETH && value > 0) {
            (bool success, ) = payable(to).call{value: value}("");
            require(success, "ETH transfer failed");
        } else if (assetType == AssetType.ERC721 && tokenId > 0) {
            IERC721(nftContract).transferFrom(from, to, tokenId);
            emit NFTTransferred(swapId, nftContract, to, tokenId);
        } else if (assetType == AssetType.ERC1155 && value > 0) {
            IERC1155(nftContract).safeTransferFrom(from, to, tokenId, value, "");
            emit NFTTransferred(swapId, nftContract, to, tokenId);
        }
    }

    /**
     * @dev Cancel a pending or accepted swap with refunds
     */
    function cancelSwap(uint256 swapId) external nonReentrant onlyParty(swapId) {
        Swap storage s = swaps[swapId];
        require(
            s.status == SwapStatus.Pending || s.status == SwapStatus.Accepted,
            "Cannot cancel this swap"
        );

        s.status = SwapStatus.Cancelled;

        // Refund partyA if they paid in ETH and initiated
        if (s.assetTypeA == AssetType.ETH && s.valueA > 0 && msg.sender == s.partyA) {
            (bool success, ) = payable(s.partyA).call{value: s.valueA}("");
            require(success, "Refund to partyA failed");
            emit FundsRefunded(swapId, s.partyA, s.valueA);
        }

        // Refund partyB if they paid in ETH and accepted
        if (s.assetTypeB == AssetType.ETH && s.valueB > 0 && s.status == SwapStatus.Accepted && msg.sender == s.partyB) {
            (bool success, ) = payable(s.partyB).call{value: s.valueB}("");
            require(success, "Refund to partyB failed");
            emit FundsRefunded(swapId, s.partyB, s.valueB);
        }

        emit SwapCancelled(swapId, msg.sender, block.timestamp);
    }

    /**
     * @dev Raise a dispute on an accepted swap
     */
    function disputeSwap(uint256 swapId) external nonReentrant onlyParty(swapId) {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Accepted, "Swap must be accepted to dispute");
        s.status = SwapStatus.Disputed;
        s.disputedAt = block.timestamp;
        emit SwapDisputed(swapId, msg.sender, block.timestamp);
    }

    /**
     * @dev Admin resolves a disputed swap (complete or refund both parties)
     */
    function resolveDispute(uint256 swapId, bool complete) external nonReentrant onlyAdmin {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Disputed, "Swap not disputed");
        
        if (complete) {
            // Execute the swap
            s.status = SwapStatus.Completed;
            s.completedAt = block.timestamp;
            _transferAsset(s.partyA, s.partyB, s.assetTypeA, s.nftContractA, s.valueA, s.tokenIdA, swapId);
            _transferAsset(s.partyB, s.partyA, s.assetTypeB, s.nftContractB, s.valueB, s.tokenIdB, swapId);
            emit SwapCompleted(swapId, block.timestamp);
        } else {
            // Refund both parties
            s.status = SwapStatus.RefundedOnDispute;
            if (s.assetTypeA == AssetType.ETH && s.valueA > 0) {
                (bool success, ) = payable(s.partyA).call{value: s.valueA}("");
                require(success, "Refund to partyA failed");
                emit FundsRefunded(swapId, s.partyA, s.valueA);
            }
            if (s.assetTypeB == AssetType.ETH && s.valueB > 0) {
                (bool success, ) = payable(s.partyB).call{value: s.valueB}("");
                require(success, "Refund to partyB failed");
                emit FundsRefunded(swapId, s.partyB, s.valueB);
            }
        }
        
        emit DisputeResolved(swapId, complete, msg.sender);
    }

    /**
     * @dev Auto-refund if dispute is unresolved after resolution window
     */
    function autoRefundOnTimeoutDispute(uint256 swapId) external nonReentrant {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Disputed, "Swap not disputed");
        require(block.timestamp > s.disputedAt + disputeResolutionWindow, "Resolution window not expired");

        s.status = SwapStatus.RefundedOnDispute;

        // Auto-refund both parties
        if (s.assetTypeA == AssetType.ETH && s.valueA > 0) {
            (bool success, ) = payable(s.partyA).call{value: s.valueA}("");
            require(success, "Refund to partyA failed");
            emit FundsRefunded(swapId, s.partyA, s.valueA);
        }
        if (s.assetTypeB == AssetType.ETH && s.valueB > 0) {
            (bool success, ) = payable(s.partyB).call{value: s.valueB}("");
            require(success, "Refund to partyB failed");
            emit FundsRefunded(swapId, s.partyB, s.valueB);
        }

        emit DisputeResolved(swapId, false, msg.sender);
    }

    /**
     * @dev Get swap details
     */
    function getSwap(uint256 swapId) external view returns (Swap memory) {
        return swaps[swapId];
    }

    /**
     * @dev Update dispute resolution window (admin only)
     */
    function setDisputeResolutionWindow(uint256 newWindow) external onlyAdmin {
        require(newWindow > 0, "Window must be > 0");
        disputeResolutionWindow = newWindow;
    }

    /**
     * @dev Fallback to receive ETH
     */
    receive() external payable {}
}
