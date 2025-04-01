// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AssetToken is ERC721, Ownable {
    using Strings for uint256;

    struct Asset {
        string assetId;
        address owner;
        bytes32 assetHash;
        string metadata;
        bool exists;
        uint256 timestamp;
    }

    uint256 private _tokenIdCounter;
    mapping(bytes32 => Asset) private _assets;
    mapping(string => bytes32) private _assetIdToHash;
    mapping(uint256 => bytes32) private _tokenIdToHash;

    event AssetMinted(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 assetHash,
        string assetId
    );

    constructor() ERC721("Asset Token", "AST") Ownable(msg.sender) {}

    function mintAsset(
        address to,
        bytes32 assetHash,
        string calldata metadata
    ) external onlyOwner returns (uint256) {
        require(!_assets[assetHash].exists, "Asset already exists");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);

        Asset memory newAsset = Asset({
            assetId: string(abi.encodePacked("AST", tokenId.toString())),
            owner: to,
            assetHash: assetHash,
            metadata: metadata,
            exists: true,
            timestamp: block.timestamp
        });

        _assets[assetHash] = newAsset;
        _tokenIdToHash[tokenId] = assetHash;
        _assetIdToHash[newAsset.assetId] = assetHash;

        emit AssetMinted(tokenId, to, assetHash, newAsset.assetId);
        return tokenId;
    }

    function getAssetByHash(bytes32 assetHash) external view returns (
        string memory assetId,
        address owner,
        string memory metadata,
        bool exists,
        uint256 timestamp
    ) {
        Asset memory asset = _assets[assetHash];
        return (
            asset.assetId,
            asset.owner,
            asset.metadata,
            asset.exists,
            asset.timestamp
        );
    }

    function getAssetByTokenId(uint256 tokenId) external view returns (
        string memory assetId,
        address owner,
        bytes32 assetHash,
        string memory metadata,
        bool exists,
        uint256 timestamp
    ) {
        require(_exists(tokenId), "Token does not exist");
        bytes32 hash = _tokenIdToHash[tokenId];
        Asset memory asset = _assets[hash];
        return (
            asset.assetId,
            asset.owner,
            asset.assetHash,
            asset.metadata,
            asset.exists,
            asset.timestamp
        );
    }

    function getAssetByIdentifiers(
        string calldata assetId,
        bytes32 assetHash
    ) external view returns (bool exists) {
        bytes32 storedHash = _assetIdToHash[assetId];
        if (storedHash != bytes32(0)) {
            return _assets[storedHash].exists;
        }
        return _assets[assetHash].exists;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        bytes32 assetHash = _tokenIdToHash[tokenId];
        if (_assets[assetHash].exists) {
            _assets[assetHash].owner = to;
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}