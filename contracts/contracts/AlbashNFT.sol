// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AlbashNFT
 * @dev ERC-721 NFT contract for tokenizing ideas, talents, assets, and more
 */
contract AlbashNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public marketplace;
    address public accessControl;

    enum AssetType {
        Idea,
        Talent,
        Product,
        Asset,
        Certificate,
        Experience,
        ReputationSnapshot
    }

    struct TokenMetadata {
        AssetType assetType;
        uint256 listingId; // Reference to off-chain listing
        address creator;
        uint256 createdAt;
        string originalMetadataURI;
    }

    mapping(uint256 => TokenMetadata) public tokenMetadata;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed to,
        AssetType assetType,
        string metadataURI
    );
    event MarketplaceUpdated(address indexed oldMarketplace, address indexed newMarketplace);
    event AccessControlUpdated(address indexed oldAccessControl, address indexed newAccessControl);

    modifier onlyMarketplaceOrOwner() {
        require(
            msg.sender == marketplace || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    constructor(address _accessControl) ERC721("Albash Asset", "ALBASH") Ownable() {
        accessControl = _accessControl;
    }

    function mintNFT(
        address to,
        string memory metadataURI,
        AssetType assetType,
        uint256 listingId
    ) external onlyMarketplaceOrOwner returns (uint256) {
        require(to != address(0), "Invalid address");
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        tokenMetadata[tokenId] = TokenMetadata({
            assetType: assetType,
            listingId: listingId,
            creator: to,
            createdAt: block.timestamp,
            originalMetadataURI: metadataURI
        });

        emit NFTMinted(tokenId, to, assetType, metadataURI);
        return tokenId;
    }

    function setMarketplace(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "Invalid address");
        address oldMarketplace = marketplace;
        marketplace = _marketplace;
        emit MarketplaceUpdated(oldMarketplace, _marketplace);
    }

    function setAccessControl(address _accessControl) external onlyOwner {
        require(_accessControl != address(0), "Invalid address");
        address oldAccessControl = accessControl;
        accessControl = _accessControl;
        emit AccessControlUpdated(oldAccessControl, _accessControl);
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }
}
