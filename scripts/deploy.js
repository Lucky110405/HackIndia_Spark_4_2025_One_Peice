const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const AssetRegister = await ethers.getContractFactory("AssetRegister");
  const assetContract = await AssetRegister.deploy(deployer.address);
  await assetContract.waitForDeployment();

  const assetAddress = await assetContract.getAddress();
  console.log("AssetRegister deployed to:", assetAddress);

  const Transfer = await ethers.getContractFactory("Transfer");
  const transferContract = await Transfer.deploy();
  await transferContract.waitForDeployment();

  const transferAddress = await transferContract.getAddress();
  console.log("Transfer contract deployed to:", transferAddress);

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("Asset Contract:", assetAddress);
  console.log("Transfer Contract:", transferAddress);
  console.log("Deployer:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });