const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");


describe("AssetRegister", function() {
    let assetContract;
    let owner;
    let user1;
    let user2;

    beforeEach(async function() {
        [owner, user1, user2] = await ethers.getSigners();
        
        // Deploy Asset contract
        const AssetRegister = await ethers.getContractFactory("AssetRegister");
        assetContract = await AssetRegister.deploy(owner.address);
        await assetContract.waitForDeployment();
    });

    describe("Asset Registration", function() {
        it("Should register a new asset", async function() {
            await assetContract.connect(user1).registerAsset(
                "Test Asset",
                "ipfs://QmTest"
            );

            const asset = await assetContract.getAssetDetails(0);
            expect(asset.assetDetails).to.equal("Test Asset");
            expect(asset.docUrl).to.equal("ipfs://QmTest");
            expect(asset.verified).to.be.false;
        });

        it("Should not allow duplicate assets", async function() {
            await assetContract.registerAsset("Test Asset", "ipfs://QmTest");
            await expect(
                assetContract.registerAsset("Test Asset", "ipfs://QmTest2")
            ).to.be.revertedWith("Asset already registered!");
        });
    });

    describe("Asset Verification", function() {
        it("Should verify asset by owner", async function() {
            await assetContract.connect(user1).registerAsset(
                "Test Asset",
                "ipfs://QmTest"
            );

            await assetContract.connect(owner).verifyAsset(0);
            const asset = await assetContract.getAssetDetails(0);
            expect(asset.verified).to.be.true;
        });

        it("Should not allow non-owner to verify", async function() {
            await assetContract.connect(user1).registerAsset(
                "Test Asset",
                "ipfs://QmTest"
            );

            await expect(
                assetContract.connect(user1).verifyAsset(0)
            ).to.be.revertedWithCustomError(assetContract, "OwnableUnauthorizedAccount")
             .withArgs(user1.address);
        });
    });
});