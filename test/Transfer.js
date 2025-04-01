const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Transfer", function() {
    let assetContract;
    let transferContract;
    let owner;
    let sender;
    let receiver;
    let tokenId;

    beforeEach(async function() {
        [owner, sender, receiver] = await ethers.getSigners();

        // Deploy Asset contract
        const AssetRegister = await ethers.getContractFactory("AssetRegister");
        assetContract = await AssetRegister.deploy(owner.address);
        await assetContract.waitForDeployment(); // Add this line

        // Deploy Transfer contract
        const Transfer = await ethers.getContractFactory("Transfer");
        transferContract = await Transfer.deploy();
        await transferContract.waitForDeployment(); // Add this line

        // Register an asset
        await assetContract.connect(sender).registerAsset(
            "Test Asset",
            "ipfs://QmTest"
        );
        tokenId = 0;
    });

    describe("Token Transfer", function() {
        it("Should transfer token after approval", async function() {
            // Approve transfer contract
            await assetContract.connect(sender).setApprovalForAll(
                await transferContract.getAddress(), // Use getAddress() method
                true
            );

            // Transfer token
            await transferContract.transfer(
                tokenId,
                sender.address,
                receiver.address,
                await assetContract.getAddress() // Use getAddress() method
            );

            // Verify new owner
            expect(await assetContract.ownerOf(tokenId)).to.equal(receiver.address);
        });

        it("Should fail without approval", async function() {
            await expect(
                transferContract.transfer(
                    tokenId,
                    sender.address,
                    receiver.address,
                    await assetContract.getAddress() // Use getAddress() method
                )
            ).to.be.revertedWith("You are not approved to transfer this token.");
        });
    });
});