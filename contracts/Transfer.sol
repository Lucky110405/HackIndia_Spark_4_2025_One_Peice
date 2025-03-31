// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract Transfer {

    uint tokenId;
    address senderAddress;
    address receiverAddress;
    address assetContractAddress;
    uint timestamp;

    event TokenTransferred( uint256 indexed tokenId, address indexed senderAddress, address indexed receiverAddress, address assetContractAddress, uint timestamp );

    function transfer(uint tokenNo, address fromUser, address toUser, address contractAddress) public {

        tokenId = tokenNo;
        senderAddress = fromUser;
        receiverAddress = toUser;
        assetContractAddress = contractAddress;

        IERC721 asset = IERC721( assetContractAddress );

        if(asset.ownerOf(tokenId) == senderAddress ) {

            if (asset.getApproved(tokenId) == address(this) ||
            asset.isApprovedForAll(senderAddress, address(this))) {
                
                asset.transferFrom(senderAddress, receiverAddress, tokenId);
                emit TokenTransferred(tokenId, senderAddress, receiverAddress, assetContractAddress, block.timestamp);
            } else {
                revert("You are not approved to transfer this token.");
            }

        } else {
            revert("You dont own this token.");
        }
    }

    
}

 
// IERC721 gives you access to standard NFT functions like:
// ownerOf(tokenId) - Check who owns an NFT
// transferFrom(from, to, tokenId) - Transfer an NFT
// approve(to, tokenId) - Approve another address to transfer
// balanceOf(owner) - Check how many NFTs an address owns
// This interface allows your contract to interact with any ERC721-compliant NFT contract safely and standardly.