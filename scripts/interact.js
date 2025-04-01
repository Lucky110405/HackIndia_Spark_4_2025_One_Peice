const { ethers } = require("hardhat");
require("dotenv").config();

const ASSET_CONTRACT = `${process.env.ASSET_CONTRACT}`;
const TRANSFER_CONTRACT = `${process.env.TRANSFER_CONTRACT}`;

async function main() {
    try {
        const [owner, user1] = await ethers.getSigners();
        console.log("Testing with addresses:");
        console.log("Owner:", owner.address);
        console.log("User1:", user1.address);
        console.log("User2:", user2.address);

        const AssetRegister = await ethers.getContractFactory("AssetRegister");
        const Transfer = await ethers.getContractFactory("Transfer");
        const assetContract = AssetRegister.attach(ASSET_CONTRACT);
        const transferContract = Transfer.attach(TRANSFER_CONTRACT);

        const provider = ethers.provider;
        const feeData = await provider.getFeeData();

        console.log("\nRegistering asset...");
        const tx = await assetContract.registerAsset(
            "Test Asset on Amoy",
            "ipfs://QmTest123",
            {
                maxFeePerGas: feeData.maxFeePerGas,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
            }
        );

        console.log("Transaction hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

        const asset = await assetContract.getAssetDetails(0);
        console.log("\nAsset details:", {
            assetDetails: asset.assetDetails,
            docUrl: asset.docUrl,
            verified: asset.verified
        });

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });