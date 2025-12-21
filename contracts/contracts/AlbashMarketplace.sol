// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AlbashAccessControl.sol";
import "./AlbashNFT.sol";

/**
 * @title AlbashMarketplace
 * @dev Verification-gated marketplace for buying and selling NFTs
 */
contract AlbashMarketplace {
    AlbashAccessControl public accessControl;
    AlbashNFT public nftContract;
    
    address public admin;
    uint256 public platformFee = 5; // 5%

    struct Listing {
        address seller;
        uint256 price;
        bool active;
        uint256 tokenId;
        uint256 createdAt;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => uint256) public tokenToListing; // tokenId => listingId

    uint256 public listingCounter;

    event Listed(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingUpdated(uint256 indexed listingId, uint256 newPrice);
    event ListingCancelled(uint256 indexed listingId);
    event Sold(uint256 indexed listingId, uint256 indexed tokenId, address indexed buyer, uint256 price);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address _accessControl, address _nftContract) {
        admin = msg.sender;
        accessControl = AlbashAccessControl(_accessControl);
        nftContract = AlbashNFT(_nftContract);
    }

    function listItem(uint256 tokenId, uint256 price) external {
        require(accessControl.isVerified(msg.sender), "User not verified");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenToListing[tokenId]].active, "Already listed");

        listingCounter++;
        listings[listingCounter] = Listing({
            seller: msg.sender,
            price: price,
            active: true,
            tokenId: tokenId,
            createdAt: block.timestamp
        });

        tokenToListing[tokenId] = listingCounter;

        emit Listed(listingCounter, tokenId, msg.sender, price);
    }

    function updateListingPrice(uint256 listingId, uint256 newPrice) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not seller");
        require(newPrice > 0, "Price must be greater than 0");

        listing.price = newPrice;
        emit ListingUpdated(listingId, newPrice);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not seller");

        listing.active = false;
        emit ListingCancelled(listingId);
    }

    function buyItem(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own listing");

        listing.active = false;

        uint256 fee = (listing.price * platformFee) / 100;
        uint256 sellerAmount = listing.price - fee;

        // Transfer NFT
        nftContract.transferFrom(listing.seller, msg.sender, listing.tokenId);

        // Transfer payment
        payable(listing.seller).transfer(sellerAmount);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit Sold(listingId, listing.tokenId, msg.sender, listing.price);
    }

    function setPlatformFee(uint256 _fee) external onlyAdmin {
        require(_fee <= 10, "Fee cannot exceed 10%");
        uint256 oldFee = platformFee;
        platformFee = _fee;
        emit PlatformFeeUpdated(oldFee, _fee);
    }

    function withdrawFees() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }
}
