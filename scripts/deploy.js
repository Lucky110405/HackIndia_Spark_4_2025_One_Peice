const { ethers } = require("hardhat");

async function main() {
    const AssetToken = await ethers.getContractFactory("AssetToken");
    const assetToken = await AssetToken.deploy();
    await assetToken.deployed();

    console.log("AssetToken deployed to:", assetToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });