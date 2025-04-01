// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;
 
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AssetRegister is ERC721URIStorage, ERC721Pausable, Ownable {
    
    uint256 private _nextTokenId;
    struct Asset {
        string assetDetails;
        string docUrl;
        bool verified;
    }

    mapping(uint256 => Asset) private assets;
    mapping(string => bool) private registeredAssets;

    event AssetRegistered(uint256 tokenId, string assetDetails, string docUrl);
    
    constructor(address initialOwner)
        ERC721("Asset", "AST")
        Ownable(initialOwner)
    {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function registerAsset(string memory assetDetails, string memory docUrl) public {
        require(!registeredAssets[assetDetails], "Asset already registered!");

        uint256 tokenId = _nextTokenId++;
        assets[tokenId] = Asset(assetDetails, docUrl, false);
        registeredAssets[assetDetails] = true; 

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, docUrl);

        emit AssetRegistered(tokenId, assetDetails, docUrl);
    }

    function verifyAsset(uint256 tokenId) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Asset does not exist");
        assets[tokenId].verified = true;
    }

    function getAssetDetails(uint256 tokenId) public view returns (Asset memory) {
        require(_ownerOf(tokenId) != address(0), "Asset does not exist");
        return assets[tokenId];
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

        function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}