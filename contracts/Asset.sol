// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Asset is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct AssetMetadata {
        string name;
        string description;
        uint256 value;
        bool isActive;
    }

    mapping(uint256 => AssetMetadata) public assetMetadata;

    event AssetMinted(uint256 indexed tokenId, address owner, string name);
    event AssetUpdated(uint256 indexed tokenId, string name, uint256 value);

    constructor() ERC721("Digital Asset", "DNFT") {}

    function mintAsset(
        address recipient,
        string memory tokenURI,
        string memory name,
        string memory description,
        uint256 value
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        assetMetadata[newTokenId] = AssetMetadata(
            name,
            description,
            value,
            true
        );

        emit AssetMinted(newTokenId, recipient, name);
        return newTokenId;
    }

    function updateAsset(
        uint256 tokenId,
        string memory name,
        string memory description,
        uint256 value,
        string memory newTokenURI
    ) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner nor approved");
        require(assetMetadata[tokenId].isActive, "Asset does not exist");

        assetMetadata[tokenId].name = name;
        assetMetadata[tokenId].description = description;
        assetMetadata[tokenId].value = value;
        
        if (bytes(newTokenURI).length > 0) {
            _setTokenURI(tokenId, newTokenURI);
        }

        emit AssetUpdated(tokenId, name, value);
    }

    function getAsset(uint256 tokenId) public view returns (
        string memory name,
        string memory description,
        uint256 value,
        bool isActive,
        address owner,
        string memory tokenURI
    ) {
        require(_exists(tokenId), "Asset does not exist");
        AssetMetadata storage metadata = assetMetadata[tokenId];
        return (
            metadata.name,
            metadata.description,
            metadata.value,
            metadata.isActive,
            ownerOf(tokenId),
            tokenURI(tokenId)
        );
    }

    // Override transfer function to add custom logic if needed
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner nor approved");
        super.transferFrom(from, to, tokenId);
    }
}